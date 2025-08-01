package entities

import "MScProject/core_app/domain/entities"

type Role struct {
	entities.BaseEntity
	RoleName    string `gorm:"unique"`
	Description string
}

type UserRole struct {
	entities.BaseEntity
	UserID     uint
	RoleID     uint
	AssignedBy uint
}
type AuthPoint struct {
	entities.BaseEntity
	RequestMethod  string `gorm:"size:10"`
	RequestPath    string `gorm:"size:255"`
	PermissionCode string
}
type RoleAuthPoint struct {
	entities.BaseEntity
	RoleID      uint
	AuthPointID uint
}
