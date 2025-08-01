package routers

import (
	"MScProject/configs"
	"MScProject/core_app/webInterface/handllers"
)

//CreateClass(c *gin.Context)
//	DeleteClass(c *gin.Context)
//	UpdateClassInfo(c *gin.Context)
//	FindClassByID(c *gin.Context)
//	FindClassByClassCode(c *gin.Context)
//
//	CreateLecture(c *gin.Context)
//	DeleteLecture(c *gin.Context)
//	UpdateLectureInfo(c *gin.Context)
//	FindLectureByLectureID(c *gin.Context)
//	FindLecturesByClassID(c *gin.Context)
//
//	AddParticipantToClass(c *gin.Context)
//	DeleteParticipantFromClass(c *gin.Context)
//	SetRoleForParticipant(c *gin.Context)
//	FindClassesByParticipantZCodeID(c *gin.Context)
//	FindParticipantsByClassID(c *gin.Context)
func ClassRouter(classHandler *handllers.ClassHandler) {
	classGroup := R.Group("/class")
	
	{
		classGroup.POST("/create", classHandler.CreateClass)
		classGroup.POST("/delete", classHandler.DeleteClass)
	}
	authUserGroup := R.Group("/auth_user")
	authUserGroup.Use(configs.AuthMiddleWares.CheckToken())
	{
		authUserGroup.POST("/logout", userHandler.Logout)
		authUserGroup.POST("/logoff", userHandler.LogOff)
		authUserGroup.POST("/change_password", userHandler.ChangeUserPassword)
		authUserGroup.POST("/admin_reset_password", userHandler.AdminRestPassword)
		authUserGroup.GET("/userinfo", userHandler.GetUserInfo)
	}
}
