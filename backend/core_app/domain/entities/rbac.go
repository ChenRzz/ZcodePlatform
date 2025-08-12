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

func (UserRole) TableName() string {
	return "user_role"
}

type AuthPoint struct {
	BaseEntity
	RequestMethod  string `gorm:"size:10"`
	RequestPath    string `gorm:"size:255"`
	PermissionCode string
}

func (AuthPoint) TableName() string {
	return "auth_point"
}

type RoleAuthPoint struct {
	BaseEntity
	RoleID      uint
	AuthPointID uint
}

func (RoleAuthPoint) TableName() string {
	return "role_auth_point"
}
