package service

import (
	"MScProject/auth_management/rbac/domain/dto"
	"MScProject/auth_management/rbac/domain/entities"
	"MScProject/auth_management/rbac/domain/repository"
	"gorm.io/gorm"
)

type IAuthPermitService interface {
	CreateRole(db *gorm.DB, roleRequest *dto.CreateRoleRequestDTO) error
	UpdateRole(db *gorm.DB, rolerequest *dto.UpdateRoleRequestDTO) error
	FindRoleByID(db *gorm.DB, roleID uint) (*entities.Role, error)
	DeleteRole(db *gorm.DB, roleID []uint) error
	FindAllRoles(db *gorm.DB) ([]*entities.Role, error)

	CreateAuthPoint(db *gorm.DB, authDTO *dto.CreateAuthPointRequestDTO) error
	UpdateAuthPoint(db *gorm.DB, authDTO *dto.UpdateAuthPointRequestDTO) error
	DeleteAuthPoint(db *gorm.DB, authpointID []uint) error
	FindAuthPointByID(db *gorm.DB, authPointID uint) (*entities.AuthPoint, error)
	FindAllAuthPoints(db *gorm.DB) ([]*entities.AuthPoint, error)

	SetAuthPointToRole(db *gorm.DB, roleAuthpoint []*dto.AuthPointRoleDTO) error
	DeleteAuthPointToRole(db *gorm.DB, roleAuthPointID []uint) error
	FindAuthPointsByRoleID(db *gorm.DB, RoleID uint) ([]*dto.RoleAuthPoints, error)

	SetUserRoles(db *gorm.DB, userRole []*dto.UserRoleDTO) error
	DeleteUserRoles(db *gorm.DB, userRoleID []uint) error
	FindUserRoleByID(db *gorm.DB, userRoleID uint) (*entities.UserRole, error)
	FindUserRoleByUserID(db *gorm.DB, UserID uint) ([]*dto.UserRoles, error)
}

type AuthPermitService struct {
	AuthPermitRepo repository.IAuthPermitRepo
}

func NewAuthPermitService(authpermitrepo repository.IAuthPermitRepo) *AuthPermitService {
	return &AuthPermitService{AuthPermitRepo: authpermitrepo}
}

func (a *AuthPermitService) CreateRole(db *gorm.DB, roleRequest *dto.CreateRoleRequestDTO) error {
	var role *entities.Role
	role.RoleName = roleRequest.RoleName
	role.Description = roleRequest.Description
	err := a.AuthPermitRepo.CreateRole(db, role)
	return err
}
func (a *AuthPermitService) UpdateRole(db *gorm.DB, rolerequest *dto.UpdateRoleRequestDTO) error {
	var role *entities.Role
	role.ID = rolerequest.RoleID
	role.RoleName = rolerequest.RoleName
	role.Description = rolerequest.Description
	err := a.AuthPermitRepo.UpdateRole(db, role)
	return err
}
func (a *AuthPermitService) FindRoleByID(db *gorm.DB, roleID uint) (*entities.Role, error) {
	return a.AuthPermitRepo.FindRoleByID(db, roleID)
}
func (a *AuthPermitService) DeleteRole(db *gorm.DB, roleID []uint) error {
	return a.AuthPermitRepo.DeleteRole(db, roleID)
}
func (a *AuthPermitService) FindAllRoles(db *gorm.DB) ([]*entities.Role, error) {
	return a.AuthPermitRepo.FindAllRoles(db)
}

func (a *AuthPermitService) CreateAuthPoint(db *gorm.DB, authDTO *dto.CreateAuthPointRequestDTO) error {
	var authpoint *entities.AuthPoint
	authpoint.RequestMethod = authDTO.RequestMethod
	authpoint.RequestPath = authDTO.RequestPath
	authpoint.PermissionCode = authDTO.PermissionCode
	return a.AuthPermitRepo.CreateAuthPoint(db, authpoint)
}
func (a *AuthPermitService) UpdateAuthPoint(db *gorm.DB, authDTO *dto.UpdateAuthPointRequestDTO) error {
	var authpoint *entities.AuthPoint
	authpoint.ID = authDTO.AuthPointID
	authpoint.RequestMethod = authDTO.RequestMethod
	authpoint.RequestPath = authDTO.RequestPath
	authpoint.PermissionCode = authDTO.PermissionCode
	return a.AuthPermitRepo.UpdateAuthPoint(db, authpoint)
}
func (a *AuthPermitService) DeleteAuthPoint(db *gorm.DB, authpointID []uint) error {
	return a.AuthPermitRepo.DeleteAuthPoint(db, authpointID)
}
func (a *AuthPermitService) FindAuthPointByID(db *gorm.DB, authPointID uint) (*entities.AuthPoint, error) {
	return a.AuthPermitRepo.FindAuthPointByID(db, authPointID)
}
func (a *AuthPermitService) FindAllAuthPoints(db *gorm.DB) ([]*entities.AuthPoint, error) {
	return a.AuthPermitRepo.FindAllAuthPoints(db)
}

func (a *AuthPermitService) SetAuthPointToRole(db *gorm.DB, roleAuthpoint []*dto.AuthPointRoleDTO) error {
	var rap []*entities.RoleAuthPoint
	for i := 0; i < len(roleAuthpoint); i++ {
		var k entities.RoleAuthPoint
		k.RoleID = roleAuthpoint[i].RoleID
		k.AuthPointID = roleAuthpoint[i].AuthPointID
		rap = append(rap, &k)
	}
	return a.AuthPermitRepo.SetAuthPointToRole(db, rap)
}
func (a *AuthPermitService) DeleteAuthPointToRole(db *gorm.DB, roleAuthPointID []uint) error {
	return a.AuthPermitRepo.DeleteAuthPointToRole(db, roleAuthPointID)
}
func (a *AuthPermitService) FindAuthPointsByRoleID(db *gorm.DB, RoleID uint) ([]*dto.RoleAuthPoints, error) {
	return a.AuthPermitRepo.FindAuthPointsByRoleID(db, RoleID)
}

func (a *AuthPermitService) SetUserRoles(db *gorm.DB, userRole []*dto.UserRoleDTO) error {
	var ur []*entities.UserRole
	for i := 0; i < len(userRole); i++ {
		var k entities.UserRole
		k.UserID = userRole[i].UserID
		k.RoleID = userRole[i].RoleID
		k.AssignedBy = userRole[i].AssignedBy
		ur = append(ur, &k)
	}
	return a.AuthPermitRepo.SetUserRoles(db, ur)
}
func (a *AuthPermitService) DeleteUserRoles(db *gorm.DB, userRoleID []uint) error {
	return a.AuthPermitRepo.DeleteUserRoles(db, userRoleID)
}
func (a *AuthPermitService) FindUserRoleByID(db *gorm.DB, userRoleID uint) (*entities.UserRole, error) {
	return a.AuthPermitRepo.FindUserRoleByID(db, userRoleID)
}
func (a *AuthPermitService) FindUserRoleByUserID(db *gorm.DB, UserID uint) ([]*dto.UserRoles, error) {
	return a.AuthPermitRepo.FindUserRoleByUserID(db, UserID)
}
