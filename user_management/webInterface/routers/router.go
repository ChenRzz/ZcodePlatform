package routers

import (
	"MScProject/user_management/webInterface/handllers"
	"github.com/gin-gonic/gin"
)

var R *gin.Engine

func SetUpRouter(userhandler *handllers.UserHandler) {
	R = gin.Default()
	UserRouter(userhandler)
}
