package main

import (
	"MScProject/configs"
	"MScProject/core_app/webInterface/routers"
	"MScProject/online_classroom"
)

func main() {
	configs.InitALl()
	routers.SetUpRouter(configs.UserHandlers, configs.ClassHandlers, configs.AuthPermitHandlers)
	online_classroom.ClassroomRouter()
	routers.R.Run(":8081")
}
