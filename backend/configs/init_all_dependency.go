package configs

import (
	"MScProject/auth_management/token/base_Interface"
	"MScProject/auth_management/token/jwt"
	"MScProject/user_management/application"
	"MScProject/user_management/domain/repository"
	"MScProject/user_management/domain/service"
	infrastructure2 "MScProject/user_management/infrastructure"
	"MScProject/user_management/webInterface/handllers"
	"MScProject/user_management/webInterface/middleware"
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
