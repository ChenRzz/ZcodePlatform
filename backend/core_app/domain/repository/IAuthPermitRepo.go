package repository

import (
	"MScProject/core_app/domain/entities"
	"MScProject/core_app/dto"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type IAuthPermitRepo interface {
	CreateRole(db *gorm.DB, role *entities.Role) error
	UpdateRole(db *gorm.DB, role *entities.Role) error
	DeleteRole(db *gorm.DB, roleID []uint) error
	FindRoleByID(db *gorm.DB, roleID uint) (*entities.Role, error)
	FindAllRoles(db *gorm.DB) ([]*entities.Role, error)

	CreateAuthPoint(db *gorm.DB, authpoint *entities.AuthPoint) error
	UpdateAuthPoint(db *gorm.DB, authpoint *entities.AuthPoint) error
	DeleteAuthPoint(db *gorm.DB, authpointID []uint) error
	FindAuthPointByID(db *gorm.DB, authPointID uint) (*entities.AuthPoint, error)
	FindAllAuthPoints(db *gorm.DB) ([]*entities.AuthPoint, error)

	SetAuthPointToRole(db *gorm.DB, roleAuthpoint []*entities.RoleAuthPoint) error
	DeleteAuthPointToRole(db *gorm.DB, roleAuthPointID []uint) error
	FindAuthPointsByRoleID(db *gorm.DB, RoleID uint) ([]*dto.RoleAuthPoints, error)

	SetUserRoles(db *gorm.DB, userRole []*entities.UserRole) error
	DeleteUserRoles(db *gorm.DB, userRoleID []uint) error
	FindUserRoleByID(db *gorm.DB, userRoleID uint) (*entities.UserRole, error)
	FindUserRoleByUserID(db *gorm.DB, UserID uint) ([]*dto.UserRoles, error)
}

type AuthPermitRepo struct {
}

func NewAuthPermitRepo() *AuthPermitRepo {
	return &AuthPermitRepo{}
}

func (a *AuthPermitRepo) CreateRole(db *gorm.DB, role *entities.Role) error {
	err := db.Create(role).Error
	if err != nil {
		return err
	}
	return nil
}
func (a *AuthPermitRepo) UpdateRole(db *gorm.DB, role *entities.Role) error {
	err := db.Save(role).Error
	if err != nil {
		return err
	}
	return nil
}
func (a *AuthPermitRepo) DeleteRole(db *gorm.DB, roleID []uint) error {
	err := db.Where("id IN ?", roleID).Delete(&entities.Role{}).Error
	return err
}
func (a *AuthPermitRepo) FindRoleByID(db *gorm.DB, roleID uint) (*entities.Role, error) {
	var role entities.Role
	var err error
	err = db.Where("ID=?", roleID).First(&role).Error
	if err != nil {
		return nil, err
	}
	return &role, nil
}
func (a *AuthPermitRepo) FindAllRoles(db *gorm.DB) ([]*entities.Role, error) {
	var roles []*entities.Role
	if err := db.Find(&roles).Error; err != nil {
		return nil, err
	}
	return roles, nil
}

func (a *AuthPermitRepo) CreateAuthPoint(db *gorm.DB, authpoint *entities.AuthPoint) error {
	err := db.Create(authpoint).Error
	if err != nil {
		return err
	}
	return nil
}
func (a *AuthPermitRepo) UpdateAuthPoint(db *gorm.DB, authpoint *entities.AuthPoint) error {
	err := db.Save(authpoint).Error
	if err != nil {
		return err
	}
	return nil
}
func (a *AuthPermitRepo) DeleteAuthPoint(db *gorm.DB, authpointID []uint) error {
	err := db.Where("id IN ?").Delete(&entities.AuthPoint{}).Error
	if err != nil {
		return err
	}
	return nil
}
func (a *AuthPermitRepo) FindAuthPointByID(db *gorm.DB, authPointID uint) (*entities.AuthPoint, error) {
	var authpoint entities.AuthPoint
	err := db.Where("ID=?", authPointID).First(&authpoint).Error
	if err != nil {
		return nil, err
	}
	return &authpoint, nil
}
func (a *AuthPermitRepo) FindAllAuthPoints(db *gorm.DB) ([]*entities.AuthPoint, error) {
	var authpoints []*entities.AuthPoint
	err := db.Find(&authpoints).Error
	if err != nil {
		return nil, err
	}
	return authpoints, nil
}

func (a *AuthPermitRepo) SetAuthPointToRole(db *gorm.DB, roleAuthpoint []*entities.RoleAuthPoint) error {
	err := db.Clauses(clause.OnConflict{
		Columns:   []clause.Column{{Name: "role_id"}, {Name: "auth_point_id"}},
		DoNothing: true,
	}).Create(&roleAuthpoint).Error
	if err != nil {
		return err
	}
	return nil
}
func (a *AuthPermitRepo) DeleteAuthPointToRole(db *gorm.DB, roleAuthPointID []uint) error {
	err := db.Where("ID IN ?", roleAuthPointID).Delete(&entities.RoleAuthPoint{}).Error
	if err != nil {
		return err
	}
	return nil
}
func (a *AuthPermitRepo) FindAuthPointsByRoleID(db *gorm.DB, RoleID uint) ([]*dto.RoleAuthPoints, error) {
	var result []*dto.RoleAuthPoints
	sql := `SELECT 
	    r.id AS role_auth_point_id,
	    a.request_method,
	    a.request_path,
	    a.permission_code
	FROM 
	    roleauthpoint r
	JOIN 
	    authpoint a ON r.auth_point_id = a.id
	WHERE 
	    r.role_id = ?
	`
	err := db.Raw(sql, RoleID).Scan(&result).Error
	return result, err
}

func (a *AuthPermitRepo) SetUserRoles(db *gorm.DB, userRole []*entities.UserRole) error {

	err := db.Clauses(clause.OnConflict{
		Columns:   []clause.Column{{Name: "role_id"}, {Name: "user_id"}},
		DoNothing: true,
	}).Create(&userRole).Error
	return err
}
func (a *AuthPermitRepo) DeleteUserRoles(db *gorm.DB, userRoleID []uint) error {
	err := db.Where("id IN ?", userRoleID).Delete(&entities.UserRole{}).Error
	return err
}

func (a *AuthPermitRepo) FindUserRoleByID(db *gorm.DB, userRoleID uint) (*entities.UserRole, error) {
	var userrole *entities.UserRole
	err := db.Where("id = ?", userRoleID).First(&userrole).Error
	return userrole, err
}
func (a *AuthPermitRepo) FindUserRoleByUserID(db *gorm.DB, UserID uint) ([]*dto.UserRoles, error) {
	var result []*dto.UserRoles
	sql := `
        SELECT 
            ur.id AS user_role_id,
            r.role_name,
            r.description
        FROM 
            user_role ur
        JOIN 
            role r ON ur.role_id = r.id
        WHERE 
            ur.user_id = ?
    `

	err := db.Raw(sql, UserID).Scan(&result).Error
	return result, err
}
