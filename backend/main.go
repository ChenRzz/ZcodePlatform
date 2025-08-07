package main

import (
	"MScProject/configs"
	"MScProject/core_app/webInterface/routers"
)

func main() {
	configs.InitALl()
	routers.SetUpRouter(configs.UserHandlers, configs.ClassHandlers, configs.AuthPermitHandlers)
	routers.R.Run(":8081")
}
