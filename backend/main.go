package main

import (
	"MScProject/configs"
	"MScProject/user_management/webInterface/routers"
)

func main() {
	configs.InitALl()
	routers.SetUpRouter(configs.UserHandlers)
	routers.R.Run(":8081")
}
