package configs

import (
	"MScProject/auth_management/token/base_Interface"
	"MScProject/auth_management/token/jwt"
	"MScProject/core_app/application"
	"MScProject/core_app/domain/repository"
	"MScProject/core_app/domain/service"
	infrastructure2 "MScProject/core_app/infrastructure"
	"MScProject/core_app/webInterface/handllers"
	"MScProject/core_app/webInterface/middleware"
)

var (
	UserServices     service.IUserService
	UserApplications application.IUserApplication
	UserHandlers     *handllers.UserHandler
	Authtokens       base_Interface.IToken[string]
	UserRepos        repository.IUserRepository
	AuthMiddleWares  *middleware.AuthMiddleWare
)

func InitALl() {
	infrastructure2.InitRedis()
	infrastructure2.SetupDatabase()
	Authtokens = jwt.NewJwtManagement()
	UserRepos = repository.NewUserRepoMsql()
	UserServices = service.NewUserService(UserRepos)
	UserApplications = application.NewUserApplication(UserServices)
	UserHandlers = handllers.NewUserHandler(UserApplications, Authtokens)
	AuthMiddleWares = middleware.NewAuthMiddleWare(Authtokens)
}
