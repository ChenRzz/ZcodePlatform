package routers

import (
	"MScProject/configs"
	"MScProject/core_app/webInterface/handllers"
)

func UserRouter(userHandler *handllers.UserHandler) {
	userGroup := R.Group("/user")
	{
		userGroup.POST("/register", userHandler.Register)
		userGroup.POST("/login", userHandler.Login)
	}
	authUserGroup := R.Group("/auth_user")
	authUserGroup.Use(configs.AuthMiddleWares.CheckToken())
	{
		authUserGroup.POST("/logout", userHandler.Logout)
		authUserGroup.POST("/logoff", userHandler.LogOff)
		authUserGroup.POST("/change_password", userHandler.ChangeUserPassword)
		authUserGroup.POST("/admin_reset_password", userHandler.AdminRestPassword)
		authUserGroup.GET("/userinfo", userHandler.GetUserInfo)
		authUserGroup.POST("/userinfo/byZcode", userHandler.FindByUserZCode)
	}
}
