package online_classroom

import (
	"MScProject/configs"
	"MScProject/core_app/webInterface/routers"
	"MScProject/online_classroom/execution"
)

func ClassroomRouter() {
	routers.R.GET("/ws/classroom/:lecture_id", WebSocketUpgradeHandler)
	api := routers.R.Group("/api")
	api.Use(configs.AuthMiddleWares.CheckToken())
	{
		classroom := api.Group("/classroom")
		{
			classroom.POST("/join", JoinClassroomHandler)
			classroom.GET("/:lecture_id/state", GetClassroomStateHandler)
		}
		execut := api.Group("/execution")
		{
			execut.POST("/execute", execution.ExecuteCodeHandler)
			execut.GET("/result/:id", execution.GetExecutionResultHandler)
		}

		api.GET("/stats", GetStatsHandler)

	}
}
