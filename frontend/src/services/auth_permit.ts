import axios from "../utils/axios";
import type {AuthPointInfo, RoleAuthPointsInfo, RoleInfo, UserRolesInfo} from "../dto/response/auth";
import type {
    CreateAuthPointRequest,
    CreateRoleRequest, DeleteAuthPointOfRoleRequest,
    DeleteAuthPointRequest,
    DeleteRoleRequest, DeleteUserRoleRequest,
    getAuthPointOfRoleRequest,
    getAuthPointRequestByPermission, getUserRolesByUIDRequest,
    SetAuthPointToRoleRequest, setUserRoleRequest,
    UpdateAuthPointRequest,
    UpdateRoleRequest
} from "../dto/request/auth.ts";

export const getAllRoles = async (): Promise<RoleInfo[]> => {
    const response = await axios.get("/auth/role/all");
    return response.data.data;
};

export const createRole = async (role:CreateRoleRequest)=> {
    const response = await axios.post("/auth/role/create", role);
    return response.data;
};


export const updateRole = async (role: UpdateRoleRequest) => {
    const response = await axios.post("/auth/role/update", role);
    return response.data;
};


export const deleteRole = async (roleId:DeleteRoleRequest)=> {
    const response=await axios.post("/auth/role/delete", roleId);
    return response.data;
};



export const getAllAuthPoints = async (): Promise<AuthPointInfo[]> => {
    const response = await axios.get("/auth/authPoint/all");
    return response.data.data;
};


export const createAuthPoint = async (authPoint:CreateAuthPointRequest)=> {
    const response = await axios.post("/auth/authPoint/create", authPoint);
    return response.data;
};

export const updateAuthPoint = async (authPoint:UpdateAuthPointRequest)=> {
    const response = await axios.post("/auth/authPoint/update", authPoint);
    return response.data;
};

export const deleteAuthPoint = async (authpointid:DeleteAuthPointRequest)=> {
    const response=await axios.post("/auth/authPoint/delete", authpointid);
    return response.data;
};

export const getAuthPointByPermission = async (authpointPermission:getAuthPointRequestByPermission):Promise<AuthPointInfo>=> {
    const response=await axios.post("/auth/authPoint/byPermissionCode", authpointPermission);
    return response.data.data;
};




export  const getAuthPointOfRole= async(roleid:getAuthPointOfRoleRequest):Promise<RoleAuthPointsInfo[]>=>{
    const response = await axios.post("/auth/role/auth_point/all",roleid);
    return response.data.data;
}

export const setAuthPointToRole= async (roleAuthPoint:SetAuthPointToRoleRequest[])=>{
    const response = await axios.post("/auth/role/auth_point/add",roleAuthPoint);
    return response.data;
}

export const deleteAuthPointOfRole= async (roleAuthPoint:DeleteAuthPointOfRoleRequest)=>{
    const response = await axios.post("/auth/role/auth_point/delete",roleAuthPoint);
    return response.data;
}


export  const getUserRolesByUID= async(userid:getUserRolesByUIDRequest):Promise<UserRolesInfo[]>=>{
    const response = await axios.post("/auth/user_role/by_userID",userid);
    return response.data.data;
}

export  const DeleteUserRole= async(userRoleid:DeleteUserRoleRequest)=>{
    const response = await axios.post("/auth/user_role/delete",userRoleid);
    return response.data;
}

export  const setUserRole= async(userRoles:setUserRoleRequest[])=>{
    const response = await axios.post("/auth/user_role/add",userRoles);
    return response.data;
}


