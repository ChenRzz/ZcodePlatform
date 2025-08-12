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



//authGroup := R.Group("/auth")
// 	authGroup.Use(configs.AuthMiddleWares.CheckToken())
// 	roleGroup := authGroup.Group("/role")
// 	{
// 		roleGroup.POST("/create", authhandler.CreateRole)
// 		roleGroup.POST("/update", authhandler.UpdateRole)
// 		roleGroup.POST("/delete", authhandler.DeleteRole)
// 		roleGroup.POST("/byID", authhandler.FindRoleByID)
// 		roleGroup.GET("/all", authhandler.FindAllRoles)
//
// 		roleGroup.POST("/auth_point/add", authhandler.SetAuthPointToRole)
// 		roleGroup.POST("/auth_point/delete", authhandler.DeleteAuthPointToRole)
// 		roleGroup.POST("/auth_point/all", authhandler.FindAuthPointsByRoleID)
// 	}
// 	authPointGroup := authGroup.Group("/authPoint")
// 	{
// 		authPointGroup.POST("/create", authhandler.CreateAuthPoint)
// 		authPointGroup.POST("/update", authhandler.UpdateAuthPoint)
// 		authPointGroup.POST("/delete", authhandler.DeleteAuthPoint)
// 		authPointGroup.POST("/byID", authhandler.FindAuthPointByID)
// 		authPointGroup.GET("/all", authhandler.FindAllAuthPoints)
// 	}
// 	userRoleGroup := authGroup.Group("/user_role")
// 	{
// 		userRoleGroup.POST("/add", authhandler.SetUserRoles)
// 		userRoleGroup.POST("/delete", authhandler.DeleteUserRoles)
// 		userRoleGroup.POST("/byID", authhandler.FindUserRoleByID)
// 		userRoleGroup.POST("/byUID", authhandler.FindUserRoleByUserID)
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
    return response.data;  // 返回更新后的角色信息
};


export const deleteRole = async (roleId:DeleteRoleRequest)=> {
    const response=await axios.post("/auth/role/delete", roleId);
    return response.data;
};


// authPointGroup.POST("/create", authhandler.CreateAuthPoint)
// authPointGroup.POST("/update", authhandler.UpdateAuthPoint)
// authPointGroup.POST("/delete", authhandler.DeleteAuthPoint)
// authPointGroup.POST("/byID", authhandler.FindAuthPointByID)
// authPointGroup.GET("/all", authhandler.FindAllAuthPoints)

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

//export interface getUserRolesByUIDRequest{
//     user_id:number;
// }
//
//
// export interface DeleteUserRoleRequest{
//     user_role_id:number;
// }
//
// export interface setUserRoleRequest{
//     user_id:number;
//     role_id:number;
//     assigned_by:number;
// }
//export interface UserRolesInfo {
//     user_role_id: number;
//     role_name: string;
//     description: string;
// }

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


