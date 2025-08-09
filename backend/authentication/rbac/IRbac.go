package rbac

import (
	"MScProject/core_app/infrastructure"
	"context"
	"fmt"
	"github.com/go-redis/redis/v8"
	"gorm.io/gorm"
	"strings"
	"time"
)

type UrlInfo struct {
	RequestMethod string `json:"request_method"`
	RequestPath   string `json:"request_path"`
}

type IRbacService interface {
	GetUserAuthPoints(userid uint) ([]*UrlInfo, error)
	CheckUserAuthPoint(userAuthPoints []*UrlInfo, apiUrl UrlInfo) bool
	ExpireCacheAuth(roleids []uint) error
}

type AuthenticationService struct {
	RedisClient *redis.Client
}

func getPermissionsForRole(roleID uint, db *gorm.DB) ([]*UrlInfo, error) {
	var urlInfo []*UrlInfo
	sql := `
        SELECT ap.request_method, ap.request_path
        FROM auth_point ap
        WHERE ap.id IN (
            SELECT DISTINCT rap.auth_point_id
            FROM role_auth_point rap
            WHERE rap.role_id = ?
        );
    `
	err := db.Raw(sql, roleID).Scan(&urlInfo).Error
	if err != nil {
		return nil, err
	}
	return urlInfo, nil
}
func NewAuthenticationService(client *redis.Client) *AuthenticationService {
	return &AuthenticationService{client}
}

func (a *AuthenticationService) GetUserAuthPoints(userid uint) ([]*UrlInfo, error) {
	db := infrastructure.GetDB()
	ctx := context.Background()
	var roleIDs []uint
	sql := `select role_id from user_role where user_id=?`
	err := db.Raw(sql, userid).Scan(&roleIDs).Error
	if err != nil {
		return nil, err
	}

	keys := make([]string, len(roleIDs))
	for i, roleID := range roleIDs {
		keys[i] = fmt.Sprintf("role_permissions:%d", roleID)
	}

	allPermStrings, err := a.RedisClient.SUnion(ctx, keys...).Result()
	if err != nil {
		return nil, err
	}

	if len(allPermStrings) == 0 {
		for _, roleID := range roleIDs {
			permsFromDB, err := getPermissionsForRole(roleID, db)
			if err != nil {
				return nil, err
			}
			if len(permsFromDB) > 0 {
				members := make([]interface{}, len(permsFromDB))
				for i, p := range permsFromDB {
					members[i] = fmt.Sprintf("%s:%s", p.RequestMethod, p.RequestPath)
				}
				key := fmt.Sprintf("role_permissions:%d", roleID)
				a.RedisClient.SAdd(ctx, key, members...)
				a.RedisClient.Expire(ctx, key, 24*time.Hour)
				for _, m := range members {
					allPermStrings = append(allPermStrings, m.(string))
				}
			}
		}
	}

	var allPermissions []*UrlInfo
	for _, permStr := range allPermStrings {
		parts := strings.SplitN(permStr, ":", 2)
		if len(parts) == 2 {
			allPermissions = append(allPermissions, &UrlInfo{
				RequestMethod: parts[0],
				RequestPath:   parts[1],
			})
		}
	}

	return allPermissions, nil
}

func (a *AuthenticationService) CheckUserAuthPoint(userAuthPoints []*UrlInfo, apiUrl UrlInfo) bool {
	exist := false
	for _, url := range userAuthPoints {
		if url.RequestMethod != apiUrl.RequestMethod {
			continue
		} else {
			if url.RequestPath == apiUrl.RequestPath {
				exist = true
				break
			} else {
				continue
			}
		}
	}
	return exist
}

func (a *AuthenticationService) ExpireCacheAuth(roleIds []uint) error {
	ctx := context.Background()

	pipe := a.RedisClient.Pipeline()

	for _, roleId := range roleIds {
		cacheKey := fmt.Sprintf("role_permissions:%d", roleId)
		pipe.Del(ctx, cacheKey)
	}

	_, err := pipe.Exec(ctx)
	if err != nil {
		fmt.Printf("Failed to delete cache for roles: %v\n", err)
		return err
	}

	return nil
}
