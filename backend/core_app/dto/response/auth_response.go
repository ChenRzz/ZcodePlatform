package response

type RoleInfo struct {
	RoleID          uint   `json:"role_id"`
	RoleName        string `json:"role_name"`
	RoleDescription string `json:"role_description"`
}

type AuthPointInfo struct {
	AuthPointID    uint   `json:"auth_point_id"`
	RequestMethod  string `json:"request_method"`
	RequestPath    string `json:"request_path"`
	PermissionCode string `json:"permission_code"`
}

type RoleAuthPointsInfo struct {
	RoleAuthPointID uint   `json:"role_auth_point_id,omitempty"`
	RequestMethod   string `json:"request_method,omitempty"`
	RequestPath     string `json:"request_path,omitempty"`
	PermissionCode  string `json:"permission_code,omitempty"`
}

type UserRoleInfo struct {
	UserRoleID uint   `json:"user_role_id"`
	Username   string `json:"username"`
	RoleName   string `json:"role_name"`
}
