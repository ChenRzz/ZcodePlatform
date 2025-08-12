
export interface CreateRoleRequest{
    role_name:string;
    description: string;
}

export interface UpdateRoleRequest{
    role_id:number;
    role_name:string;
    description:string;
}


export interface DeleteRoleRequest{
    role_id:number;
}

export interface CreateAuthPointRequest{
    request_method:string;
    request_path:string;
    permission_code:string;
}

export interface UpdateAuthPointRequest{
    auth_point_id:number;
    request_method:string;
    request_path:string;
    permission_code:string;
}

export interface DeleteAuthPointRequest{
    auth_point_id:number
}
export interface getAuthPointRequestByPermission{
    permission_code:string
}



export interface getAuthPointOfRoleRequest{
    role_id:number;
}

export interface SetAuthPointToRoleRequest{
    role_id:number;
    auth_point_id:number;
}

export interface DeleteAuthPointOfRoleRequest{
    role_auth_point_id:number;
}


export interface getUserRolesByUIDRequest{
    user_id:number;
}


export interface DeleteUserRoleRequest{
    user_role_id:number;
}

export interface setUserRoleRequest{
    user_id:number;
    role_id:number;
    assigned_by:number;
}