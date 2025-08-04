package entities

type Role struct {
	BaseEntity
	RoleName    string `gorm:"unique"`
	Description string
}

type UserRole struct {
	BaseEntity
	UserID     uint
	RoleID     uint
	AssignedBy uint
}
type AuthPoint struct {
	BaseEntity
	RequestMethod  string `gorm:"size:10"`
	RequestPath    string `gorm:"size:255"`
	PermissionCode string
}
type RoleAuthPoint struct {
	BaseEntity
	RoleID      uint
	AuthPointID uint
}
