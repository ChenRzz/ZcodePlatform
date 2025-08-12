
export interface RoleInfo {
    role_id: number;
    role_name: string;
    role_description: string;
}


export interface AuthPointInfo {
    auth_point_id: number;
    request_method: string;
    request_path: string;
    permission_code: string;
}


export interface RoleAuthPointsInfo {
    role_auth_point_id: number;
    request_method: string;
    request_path: string;
    permission_code: string;
}


export interface UserRoleInfo {
    user_role_id: number;
    username: string;
    role_name: string;
}

export interface UserRolesInfo {
    user_role_id: number;
    role_name: string;
    description: string;
}