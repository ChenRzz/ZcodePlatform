package config

import (
	"MScProject/auth_management/token/base_Interface"
	"MScProject/auth_management/token/jwt"
	"MScProject/infrastructure"
	"MScProject/user_management/application"
	"MScProject/user_management/domain/repository"
	"MScProject/user_management/domain/service"
	"MScProject/user_management/webInterface/handlers"
	"MScProject/user_management/webInterface/middleware"
)

var (
	UserServices     service.IUserService
	UserApplications application.IUserApplication
	UserHandlers     handlers.IUserHandler
	Authtokens       base_Interface.IToken[string]
	UserRepos        repository.IUserRepository
	AuthMiddleWares  *middleware.AuthMiddleWare
)

func InitALl() {
	infrastructure.InitRedis()
	infrastructure.InitDB()
	Authtokens = jwt.NewJwtManagement()
	UserRepos = repository.NewUserRepoMsql()
	UserServices = service.NewUserService(UserRepos)
	UserApplications = application.NewUserApplication(UserServices)
	UserHandlers = handlers.NewUserHandler(UserApplications, Authtokens)
	AuthMiddleWares = middleware.NewAuthMiddleWare(Authtokens)
}
