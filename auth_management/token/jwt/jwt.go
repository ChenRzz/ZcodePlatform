package jwt

import (
	"MScProject/auth_management/token/base_Interface"
	"MScProject/infrastructure"
	"context"
	"fmt"
	"github.com/go-redis/redis/v8"
	"github.com/golang-jwt/jwt/v5"
	"time"
)

var secretKey = "hsaihdnwjsahiu712iwj12w"

type JwtClaims struct {
	UserID   uint
	Username string

	jwt.RegisteredClaims
}

type JwtManagement struct {
	redisClient *redis.Client
	ctx         context.Context
}

var _ base_Interface.IToken[string] = (*JwtManagement)(nil)

func NewJwtManagement() *JwtManagement {
	return &JwtManagement{infrastructure.RedisClient, context.Background()}
}

func (j *JwtManagement) GenerateToken(userinfo *base_Interface.Userinfo) (tokenString string, err error) {
	claim := JwtClaims{
		UserID:   userinfo.UserIDInfo,
		Username: userinfo.UsernameInfo,
		RegisteredClaims: jwt.RegisteredClaims{
			Subject:   string(userinfo.UserIDInfo), // 用户ID作为主题
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			Issuer:    "CrzMscProject",
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claim)
	tokenString, err = token.SignedString(secretKey)
	if err != nil {
		return "", err
	}
	return tokenString, err
}

func (j *JwtManagement) CheckParseToken(token string) (*base_Interface.Userinfo, error) {
	blacklistKey := "jwt_blacklist:" + token
	exists, err := j.redisClient.Exists(j.ctx, blacklistKey).Result()
	if err != nil {
		fmt.Println("Redis Error: %v\n", err)
	}
	if exists > 0 {
		return nil, err
	}
	claims := &JwtClaims{}
	tokenx, err := jwt.ParseWithClaims(token, claims, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(secretKey), nil
	})

	if err != nil || !tokenx.Valid {
		fmt.Printf("Token invalid: %v\n", err)
		return nil, err
	}
	userinfo := &base_Interface.Userinfo{
		UserIDInfo:   claims.UserID,
		UsernameInfo: claims.Username,
	}
	return userinfo, nil
}

func (j *JwtManagement) ExpireToken(token string) error {
	tokenx, err := jwt.ParseWithClaims(token, &JwtClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(secretKey), nil
	})
	if err != nil {
		return fmt.Errorf("invalid token: %w", err)
	}
	claims, ok := tokenx.Claims.(*JwtClaims)
	if !ok || !tokenx.Valid {
		return fmt.Errorf("invalid claims or token")
	}
	expiration := time.Until(claims.ExpiresAt.Time)
	if expiration <= 0 {
		return nil
	}
	blacklistKey := "jwt_blacklist:" + token
	err = j.redisClient.Set(j.ctx, blacklistKey, "blacklisted", expiration).Err()
	if err != nil {
		return fmt.Errorf("failed to set blacklist in Redis: %w", err)
	}
	return nil
}
