package configs

import (
	"MScProject/authentication/rbac"
	"MScProject/authentication/token/base_Interface"
	"MScProject/authentication/token/jwt"
	"MScProject/core_app/application"
	"MScProject/core_app/domain/repository"
	"MScProject/core_app/domain/service"
	"MScProject/core_app/infrastructure"
	"MScProject/core_app/webInterface/handllers"
	"MScProject/core_app/webInterface/middleware"
)

var (
	Authtokens  base_Interface.IToken[string]
	RbacService rbac.IRbacService

	UserRepos       repository.IUserRepository
	ClassRepos      repository.IClassRepo
	AuthPermitRepos repository.IAuthPermitRepo

	UserServices       service.IUserService
	ClassServices      service.IClassService
	AuthPermitServices service.IAuthPermitService

	UserApplications       application.IUserApplication
	ClassApplications      application.IClassApplication
	AuthPermitApplications application.IAuthPermitApplication

	UserHandlers       *handllers.UserHandler
	ClassHandlers      *handllers.ClassHandler
	AuthPermitHandlers *handllers.AuthPermitHandler

	AuthMiddleWares *middleware.AuthMiddleWare
)

func InitALl() {
	infrastructure.InitRedis()
	infrastructure.SetupDatabase()

	Authtokens = jwt.NewJwtManagement()
	RbacService = rbac.NewAuthenticationService(infrastructure.RedisClient)
	AuthMiddleWares = middleware.NewAuthMiddleWare(Authtokens, RbacService)

	UserRepos = repository.NewUserRepoMsql()
	UserServices = service.NewUserService(UserRepos)
	UserApplications = application.NewUserApplication(UserServices)
	UserHandlers = handllers.NewUserHandler(UserApplications, Authtokens)

	ClassRepos = repository.NewClassRepo()
	ClassServices = service.NewClassService(ClassRepos)
	ClassApplications = application.NewClassApplication(ClassServices)
	ClassHandlers = handllers.NewClassHandler(ClassApplications)

	AuthPermitRepos = repository.NewAuthPermitRepo()
	AuthPermitServices = service.NewAuthPermitService(AuthPermitRepos)
	AuthPermitApplications = application.NewAuthPermitApplication(AuthPermitServices, RbacService)
	AuthPermitHandlers = handllers.NewAuthPermitHandler(AuthPermitApplications)
}
