package application

import (
	"MScProject/core_app/domain/entities"
	"MScProject/core_app/domain/service"
	"MScProject/core_app/dto"
	"MScProject/core_app/infrastructure"
	"gorm.io/gorm"
)

type IAuthPermitApplication interface {
	CreateRole(roleRequest *dto.CreateRoleRequestDTO) error
	UpdateRole(rolerequest *dto.UpdateRoleRequestDTO) error
	FindRoleByID(roleID uint) (*entities.Role, error)
	DeleteRole(roleID []uint) error
	FindAllRoles() ([]*entities.Role, error)

	CreateAuthPoint(authDTO *dto.CreateAuthPointRequestDTO) error
	UpdateAuthPoint(authDTO *dto.UpdateAuthPointRequestDTO) error
	DeleteAuthPoint(authpointID []uint) error
	FindAuthPointByID(authPointID uint) (*entities.AuthPoint, error)
	FindAllAuthPoints() ([]*entities.AuthPoint, error)

	SetAuthPointToRole(roleAuthpoint []*dto.AuthPointRoleDTO) error
	DeleteAuthPointToRole(roleAuthPointID []uint) error
	FindAuthPointsByRoleID(RoleID uint) ([]*dto.RoleAuthPoints, error)

	SetUserRoles(userRole []*dto.UserRoleDTO) error
	DeleteUserRoles(userRoleID []uint) error
	FindUserRoleByID(userRoleID uint) (*entities.UserRole, error)
	FindUserRoleByUserID(UserID uint) ([]*dto.UserRoles, error)
}

type AuthPermitApplication struct {
	AuthPermitService service.IAuthPermitService
}

func NewAuthPermitApplication(authPermitService service.IAuthPermitService) *AuthPermitApplication {
	return &AuthPermitApplication{authPermitService}
}

func (a *AuthPermitApplication) CreateRole(roleRequest *dto.CreateRoleRequestDTO) error {
	db := infrastructure.GetDB()
	err := db.Transaction(func(tx *gorm.DB) error {
		return a.AuthPermitService.CreateRole(tx, roleRequest)
	})
	return err
}
func (a *AuthPermitApplication) UpdateRole(rolerequest *dto.UpdateRoleRequestDTO) error {
	db := infrastructure.GetDB()
	err := db.Transaction(func(tx *gorm.DB) error {
		return a.AuthPermitService.UpdateRole(tx, rolerequest)
	})
	return err
}
func (a *AuthPermitApplication) FindRoleByID(roleID uint) (*entities.Role, error) {
	db := infrastructure.GetDB()
	var role *entities.Role
	err := db.Transaction(func(tx *gorm.DB) error {
		var err error
		role, err = a.AuthPermitService.FindRoleByID(tx, roleID)
		return err
	})
	return role, err
}
func (a *AuthPermitApplication) DeleteRole(roleID []uint) error {
	db := infrastructure.GetDB()
	err := db.Transaction(func(tx *gorm.DB) error {
		return a.AuthPermitService.DeleteRole(tx, roleID)
	})
	return err
}
func (a *AuthPermitApplication) FindAllRoles() ([]*entities.Role, error) {
	db := infrastructure.GetDB()
	var roles []*entities.Role
	err := db.Transaction(func(tx *gorm.DB) error {
		var err error
		roles, err = a.AuthPermitService.FindAllRoles(tx)
		return err
	})
	return roles, err
}

func (a *AuthPermitApplication) CreateAuthPoint(authDTO *dto.CreateAuthPointRequestDTO) error {
	db := infrastructure.GetDB()
	err := db.Transaction(func(tx *gorm.DB) error {
		return a.AuthPermitService.CreateAuthPoint(tx, authDTO)
	})
	return err
}
func (a *AuthPermitApplication) UpdateAuthPoint(authDTO *dto.UpdateAuthPointRequestDTO) error {
	db := infrastructure.GetDB()
	err := db.Transaction(func(tx *gorm.DB) error {
		return a.AuthPermitService.UpdateAuthPoint(tx, authDTO)
	})
	return err
}
func (a *AuthPermitApplication) DeleteAuthPoint(authpointID []uint) error {
	db := infrastructure.GetDB()
	err := db.Transaction(func(tx *gorm.DB) error {
		return a.AuthPermitService.DeleteAuthPoint(tx, authpointID)
	})
	return err
}
func (a *AuthPermitApplication) FindAuthPointByID(authPointID uint) (*entities.AuthPoint, error) {
	db := infrastructure.GetDB()
	return a.AuthPermitService.FindAuthPointByID(db, authPointID)
}
func (a *AuthPermitApplication) FindAllAuthPoints() ([]*entities.AuthPoint, error) {
	db := infrastructure.GetDB()
	return a.AuthPermitService.FindAllAuthPoints(db)
}

func (a *AuthPermitApplication) SetAuthPointToRole(roleAuthpoint []*dto.AuthPointRoleDTO) error {
	db := infrastructure.GetDB()
	err := db.Transaction(func(tx *gorm.DB) error {

		return a.AuthPermitService.SetAuthPointToRole(tx, roleAuthpoint)
	})
	return err
}
func (a *AuthPermitApplication) DeleteAuthPointToRole(roleAuthPointID []uint) error {
	db := infrastructure.GetDB()
	err := db.Transaction(func(tx *gorm.DB) error {

		return a.AuthPermitService.DeleteAuthPointToRole(tx, roleAuthPointID)
	})
	return err
}
func (a *AuthPermitApplication) FindAuthPointsByRoleID(RoleID uint) ([]*dto.RoleAuthPoints, error) {
	db := infrastructure.GetDB()
	var authpoints []*dto.RoleAuthPoints
	err := db.Transaction(func(tx *gorm.DB) error {
		var err error
		authpoints, err = a.AuthPermitService.FindAuthPointsByRoleID(tx, RoleID)
		return err
	})
	return authpoints, err
}

func (a *AuthPermitApplication) SetUserRoles(userRole []*dto.UserRoleDTO) error {
	db := infrastructure.GetDB()
	err := db.Transaction(func(tx *gorm.DB) error {

		return a.AuthPermitService.SetUserRoles(tx, userRole)
	})
	return err
}
func (a *AuthPermitApplication) DeleteUserRoles(userRoleID []uint) error {
	db := infrastructure.GetDB()
	err := db.Transaction(func(tx *gorm.DB) error {

		return a.AuthPermitService.DeleteUserRoles(tx, userRoleID)
	})
	return err
}
func (a *AuthPermitApplication) FindUserRoleByID(userRoleID uint) (*entities.UserRole, error) {
	db := infrastructure.GetDB()
	userrole, err := a.AuthPermitService.FindUserRoleByID(db, userRoleID)
	return userrole, err
}
func (a *AuthPermitApplication) FindUserRoleByUserID(UserID uint) ([]*dto.UserRoles, error) {
	db := infrastructure.GetDB()
	var userRoles []*dto.UserRoles
	err := db.Transaction(func(tx *gorm.DB) error {
		var err error
		userRoles, err = a.AuthPermitService.FindUserRoleByUserID(tx, UserID)
		return err
	})
	return userRoles, err
}
