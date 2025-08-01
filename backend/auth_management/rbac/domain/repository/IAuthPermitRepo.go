package repository

import (
	"MScProject/auth_management/rbac/domain/entities"
	"gorm.io/gorm"
)

type IAuthPermitRepo interface {
	CreateRole(db *gorm.DB, role *entities.Role)
	UpdateRole(db *gorm.DB, role *entities.Role)
	DeleteRole(db *gorm.DB, roleID uint)
	FindRoleByID(db *gorm.DB, roleID uint)
	FindAllRoles(db *gorm.DB)

	SetUserRoles(db *gorm.DB)
	DeleteUserRoles(db *gorm.DB)
	SetRoleUsers(db *gorm.DB)
	DeleteRoleUsers(db *gorm.DB)
	FindUserRoleByID(db *gorm.DB)
	FindUserRoleByUserID(db *gorm.DB)
	FindUSerRoleByRoleID(db *gorm.DB)

	CreateAuthPoint(db *gorm.DB)
	UpdateAuthPoint(db *gorm.DB)
	DeleteAuthPoint(db *gorm.DB)
	FindAuthPointByID(db *gorm.DB)

	SetAuthPointToRole(db *gorm.DB)
	DeleteAuthPointToRole(db *gorm.DB)
	FindAuthPointByRoleID(db *gorm.DB)
	FindRoleByAuthPointID(db *gorm.DB)
}
