package routers

import (
	"MScProject/configs"
	"MScProject/core_app/webInterface/handllers"
)

// CreateClass(c *gin.Context)
//
//	DeleteClass(c *gin.Context)
//	UpdateClassInfo(c *gin.Context)
//	FindClassByID(c *gin.Context)
//	FindClassByClassCode(c *gin.Context)
//	FindAllClasses(c *gin.Context)
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
	classGroup.GET("/all", classHandler.FindAllClasses)
	classGroup.Use(configs.AuthMiddleWares.CheckToken()).Use(configs.AuthMiddleWares.CheckPermissions())

	{
		classGroup.POST("/create", classHandler.CreateClass)
		classGroup.POST("/delete", classHandler.DeleteClass)
		classGroup.POST("/update", classHandler.UpdateClassInfo)
		classGroup.POST("/byID", classHandler.FindClassByID)
		classGroup.GET("/byCode", classHandler.FindClassByClassCode)

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
