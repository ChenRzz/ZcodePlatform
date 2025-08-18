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
		classGroup.POST("/create", classHandler.CreateClass)
		classGroup.POST("/delete", classHandler.DeleteClass)
		classGroup.POST("/update", classHandler.UpdateClassInfo)
		classGroup.POST("/byID", classHandler.FindClassByID)
		classGroup.GET("/byCode", classHandler.FindClassByClassCode)
		classGroup.GET("/byManagerZcode", classHandler.FindClassByManagerZCode)
	}

	lectureGroup := classGroup.Group("/lecture")
	{
		lectureGroup.POST("/create", classHandler.CreateLecture)
		lectureGroup.POST("/delete", classHandler.DeleteLecture)
		lectureGroup.POST("/update", classHandler.UpdateLectureInfo)
		lectureGroup.POST("/byLID", classHandler.FindLectureByLectureID)
		lectureGroup.POST("/byCID", classHandler.FindLecturesByClassID)
	}
	participantGroup := classGroup.Group("/participant")
	{
		participantGroup.POST("/add", classHandler.AddParticipantToClass)
		participantGroup.POST("/delete", classHandler.DeleteParticipantFromClass)
		participantGroup.POST("/update", classHandler.SetRoleForParticipant)
		participantGroup.GET("/byZcode", classHandler.FindClassesByParticipantZCodeID)
		participantGroup.POST("/byCID", classHandler.FindParticipantsByClassID)
		participantGroup.GET("/my_classes", classHandler.FindUserClasses)
	}

}
