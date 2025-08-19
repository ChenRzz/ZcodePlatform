package routers

import (
	"MScProject/core_app/webInterface/handllers"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"time"
)

var R *gin.Engine

func SetUpRouter(userhandler *handllers.UserHandler, classhandler *handllers.ClassHandler, authhandler *handllers.AuthPermitHandler) {
	R = gin.Default()
	R.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://51.107.216.21", "http://51.107.216.21:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))
	UserRouter(userhandler)
	ClassRouter(classhandler)
	AuthPermitRouter(authhandler)
}
