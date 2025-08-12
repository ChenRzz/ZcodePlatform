package routers

import (
	"MScProject/configs"
	"MScProject/core_app/webInterface/handllers"
)

// CreateRole(c *gin.Context)
//
//	UpdateRole(c *gin.Context)
//	FindRoleByID(c *gin.Context)
//	DeleteRole(c *gin.Context)
//	FindAllRoles(c *gin.Context)
//
//	CreateAuthPoint(c *gin.Context)
//	UpdateAuthPoint(c *gin.Context)
//	DeleteAuthPoint(c *gin.Context)
//	FindAuthPointByID(c *gin.Context)
//	FindAllAuthPoints(c *gin.Context)
//
//	SetAuthPointToRole(c *gin.Context)
//	DeleteAuthPointToRole(c *gin.Context)
//	FindAuthPointsByRoleID(c *gin.Context)
//
//	SetUserRoles(c *gin.Context)
//	DeleteUserRoles(c *gin.Context)
//	FindUserRoleByID(c *gin.Context)
//	FindUserRoleByUserID(c *gin.Context)
func AuthPermitRouter(authhandler *handllers.AuthPermitHandler) {
	authGroup := R.Group("/auth")
	authGroup.Use(configs.AuthMiddleWares.CheckToken()).Use(configs.AuthMiddleWares.CheckPermissions())
	roleGroup := authGroup.Group("/role")
	{
		roleGroup.POST("/create", authhandler.CreateRole)
		roleGroup.POST("/update", authhandler.UpdateRole)
		roleGroup.POST("/delete", authhandler.DeleteRole)
		roleGroup.POST("/byID", authhandler.FindRoleByID)
		roleGroup.GET("/all", authhandler.FindAllRoles)

		roleGroup.POST("/auth_point/add", authhandler.SetAuthPointToRole)
		roleGroup.POST("/auth_point/delete", authhandler.DeleteAuthPointToRole)
		roleGroup.POST("/auth_point/all", authhandler.FindAuthPointsByRoleID)
	}
	authPointGroup := authGroup.Group("/authPoint")
	{
		authPointGroup.POST("/create", authhandler.CreateAuthPoint)
		authPointGroup.POST("/update", authhandler.UpdateAuthPoint)
		authPointGroup.POST("/delete", authhandler.DeleteAuthPoint)
		authPointGroup.POST("/byID", authhandler.FindAuthPointByID)
		authPointGroup.POST("/byPermissionCode", authhandler.FindAuthPointByPermissionCode)
		authPointGroup.GET("/all", authhandler.FindAllAuthPoints)
	}
	userRoleGroup := authGroup.Group("/user_role")
	{
		userRoleGroup.POST("/add", authhandler.SetUserRoles)
		userRoleGroup.POST("/delete", authhandler.DeleteUserRoles)
		userRoleGroup.POST("/byID", authhandler.FindUserRoleByID)
		userRoleGroup.POST("/byUID", authhandler.FindUserRoleByUserID)
		userRoleGroup.POST("/by_userID", authhandler.FindUserRoleByUID)
	}
}
