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
		AllowOrigins:     []string{"http://localhost:5173"}, // 允许来自前端的跨域请求（根据你的前端地址修改）
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour, // 缓存预检请求的结果
	}))
	UserRouter(userhandler)
	ClassRouter(classhandler)
	AuthPermitRouter(authhandler)
}
