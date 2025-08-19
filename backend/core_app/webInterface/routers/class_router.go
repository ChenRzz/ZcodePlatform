package routers

import (
	"MScProject/configs"
	"MScProject/core_app/webInterface/handllers"
)

func ClassRouter(classHandler *handllers.ClassHandler) {
	classGroup := R.Group("/class")
	classGroup.GET("/all", classHandler.FindAllClasses)
	classGroup.Use(configs.AuthMiddleWares.CheckToken())
	{
		classGroup.POST("/create", configs.AuthMiddleWares.CheckPermissions(), classHandler.CreateClass)
		classGroup.POST("/delete", configs.AuthMiddleWares.CheckPermissions(), classHandler.DeleteClass)
		classGroup.POST("/update", configs.AuthMiddleWares.CheckPermissions(), classHandler.UpdateClassInfo)
		classGroup.POST("/byID", classHandler.FindClassByID)
		classGroup.GET("/byCode", classHandler.FindClassByClassCode)
		classGroup.GET("/byManagerZcode", configs.AuthMiddleWares.CheckPermissions(), classHandler.FindClassByManagerZCode)
	}
	lectureGroup := classGroup.Group("/lecture")
	{
		lectureGroup.POST("/create", configs.AuthMiddleWares.CheckPermissions(), classHandler.CreateLecture)
		lectureGroup.POST("/delete", configs.AuthMiddleWares.CheckPermissions(), classHandler.DeleteLecture)
		lectureGroup.POST("/update", configs.AuthMiddleWares.CheckPermissions(), classHandler.UpdateLectureInfo)
		lectureGroup.POST("/byLID", classHandler.FindLectureByLectureID)
		lectureGroup.POST("/byCID", classHandler.FindLecturesByClassID)
	}
	participantGroup := classGroup.Group("/participant")
	{
		participantGroup.POST("/add", classHandler.AddParticipantToClass)
		participantGroup.POST("/delete", configs.AuthMiddleWares.CheckPermissions(), classHandler.DeleteParticipantFromClass)
		participantGroup.POST("/update", configs.AuthMiddleWares.CheckPermissions(), classHandler.SetRoleForParticipant)
		participantGroup.GET("/byZcode", classHandler.FindClassesByParticipantZCodeID)
		participantGroup.POST("/byCID", classHandler.FindParticipantsByClassID)
		participantGroup.GET("/my_classes", classHandler.FindUserClasses)
	}
}
