package router

import (
	"MScProject/config"
	"MScProject/user_management/webInterface/handlers"
	"MScProject/user_management/webInterface/middleware"
)

func UserRouter(userHandler handlers.IUserHandler) {
	userGroup := r.Group("/user")
	{
		userGroup.POST("/register", userHandler.Register)
		userGroup.POST("/login", userHandler.Login)
	}
	authUserGroup := r.Group("/auth_user")
	authUserGroup.Use(config.AuthMiddleWares.CheckToken())
	{
		authUserGroup.POST("/logout", userHandler.Logout)
		authUserGroup.POST("/logoff", userHandler.LogOff)
		authUserGroup.POST("/change_password", userHandler.ChangeUserPassword)
		authUserGroup.POST("/admin_reset_password", userHandler.AdminRestPassword)
		authUserGroup.GET("/userinfo", userHandler.GetUserInfo)
	}
}
