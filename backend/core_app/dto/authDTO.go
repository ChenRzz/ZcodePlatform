package dto

type RoleAuthPoints struct {
	RoleAuthPointID uint   `json:"role_auth_point_id"`
	RequestMethod   string `json:"request_method"`
	RequestPath     string `json:"request_path"`
	PermissionCode  string `json:"permission_code"`
}

type UserRoles struct {
	UserRoleID  uint   `json:"user_role_id"`
	RoleName    string `json:"role_name"`
	Description string `json:"description"`
}

type CreateRoleRequestDTO struct {
	RoleName    string `json:"role_name"`
	Description string `json:"description"`
}
type UpdateRoleRequestDTO struct {
	RoleID      uint   `json:"role_id"`
	RoleName    string `json:"role_name"`
	Description string `json:"description"`
}

type CreateAuthPointRequestDTO struct {
	RequestMethod  string `json:"request_method"`
	RequestPath    string `json:"request_path"`
	PermissionCode string `json:"permission_code"`
}

type UpdateAuthPointRequestDTO struct {
	AuthPointID    uint   `json:"auth_point_id"`
	RequestMethod  string `json:"request_method"`
	RequestPath    string `json:"request_path"`
	PermissionCode string `json:"permission_code"`
}

type AuthPointRoleDTO struct {
	RoleID      uint `json:"role_id"`
	AuthPointID uint `json:"auth_point_id"`
}

type UserRoleDTO struct {
	UserID     uint ` json:"user_id"`
	RoleID     uint `json:"role_id"`
	AssignedBy uint `json:"assigned_by"`
}

type FindRoleByIDReDTO struct {
	RoleID uint ` json:"role_id"`
}

type DeleteRoleReDTO struct {
	RoleID uint ` json:"role_id"`
}

type DeleteAuthPointReDTO struct {
	AuthPointID uint `json:"auth_point_id"`
}

type FindAuthPointByIDReDTO struct {
	AuthPointID uint `json:"auth_point_id"`
}
type FindAuthPointByPermissionCode struct {
	PermissionCode string `json:"permission_code"`
}

type DeleteRoleAuthReDTO struct {
	RoleAuthPointID uint `json:"role_auth_point_id"`
}

type FindAuthPointByRoleID struct {
	RoleID uint ` json:"role_id"`
}

type DeleteUserRoleReDTO struct {
	UserRoleID uint `json:"user_role_id"`
}

type FindUserRoleByIDReDTO struct {
	UserRoleID uint `json:"user_role_id"`
}

type FindUserRoleByUIDRequest struct {
	UserID uint `json:"user_id"`
}
