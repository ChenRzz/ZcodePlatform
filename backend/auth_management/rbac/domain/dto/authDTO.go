package dto

type RoleAuthPoints struct {
	RoleAuthPointID uint
	RequestMethod   string
	RequestPath     string
	PermissionCode  string
}

type UserRoles struct {
	UserRoleID  uint
	RoleName    string
	Description string
}

type CreateRoleRequestDTO struct {
	RoleName    string
	Description string
}
type UpdateRoleRequestDTO struct {
	RoleID      uint
	RoleName    string
	Description string
}

type CreateAuthPointRequestDTO struct {
	RequestMethod  string
	RequestPath    string
	PermissionCode string
}

type UpdateAuthPointRequestDTO struct {
	AuthPointID    uint
	RequestMethod  string
	RequestPath    string
	PermissionCode string
}

type AuthPointRoleDTO struct {
	RoleID      uint
	AuthPointID uint
}

type UserRoleDTO struct {
	UserID     uint
	RoleID     uint
	AssignedBy uint
}
