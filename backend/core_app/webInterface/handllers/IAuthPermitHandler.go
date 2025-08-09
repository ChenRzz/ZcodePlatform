package handllers

import (
	"MScProject/core_app/application"
	"MScProject/core_app/dto"
	"github.com/gin-gonic/gin"
	"net/http"
)

type IAuthPermitHandler interface {
	CreateRole(c *gin.Context)
	UpdateRole(c *gin.Context)
	FindRoleByID(c *gin.Context)
	DeleteRole(c *gin.Context)
	FindAllRoles(c *gin.Context)

	CreateAuthPoint(c *gin.Context)
	UpdateAuthPoint(c *gin.Context)
	DeleteAuthPoint(c *gin.Context)
	FindAuthPointByID(c *gin.Context)
	FindAllAuthPoints(c *gin.Context)

	SetAuthPointToRole(c *gin.Context)
	DeleteAuthPointToRole(c *gin.Context)
	FindAuthPointsByRoleID(c *gin.Context)

	SetUserRoles(c *gin.Context)
	DeleteUserRoles(c *gin.Context)
	FindUserRoleByID(c *gin.Context)
	FindUserRoleByUserID(c *gin.Context)
}

type AuthPermitHandler struct {
	AuthPermitApplication application.IAuthPermitApplication
}

func NewAuthPermitHandler(authPermitHandler application.IAuthPermitApplication) *AuthPermitHandler {
	return &AuthPermitHandler{authPermitHandler}
}

func (a *AuthPermitHandler) CreateRole(c *gin.Context) {
	var req dto.CreateRoleRequestDTO
	if err := c.ShouldBind(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	err := a.AuthPermitApplication.CreateRole(&req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "successfully create the role"})
	return
}
func (a *AuthPermitHandler) UpdateRole(c *gin.Context) {
	var req dto.UpdateRoleRequestDTO
	if err := c.ShouldBind(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	err := a.AuthPermitApplication.UpdateRole(&req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "successfully Update the role"})
	return
}
func (a *AuthPermitHandler) FindRoleByID(c *gin.Context) {
	var req dto.FindRoleByIDReDTO
	if err := c.ShouldBind(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	role, err := a.AuthPermitApplication.FindRoleByID(req.RoleID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "successfully find the role",
		"data":    role,
	})
	return
}
func (a *AuthPermitHandler) DeleteRole(c *gin.Context) {

	var req dto.DeleteRoleReDTO
	if err := c.ShouldBind(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	err := a.AuthPermitApplication.DeleteRole(req.RoleID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "successfully delete the role"})
	return
}
func (a *AuthPermitHandler) FindAllRoles(c *gin.Context) {
	roles, err := a.AuthPermitApplication.FindAllRoles()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "successfully get the role",
		"data":    roles,
	})
	return
}

func (a *AuthPermitHandler) CreateAuthPoint(c *gin.Context) {
	var req dto.CreateAuthPointRequestDTO
	if err := c.ShouldBind(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	err := a.AuthPermitApplication.CreateAuthPoint(&req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "successfully create the AuthPoint"})
	return
}
func (a *AuthPermitHandler) UpdateAuthPoint(c *gin.Context) {

	var req dto.UpdateAuthPointRequestDTO
	if err := c.ShouldBind(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	err := a.AuthPermitApplication.UpdateAuthPoint(&req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "successfully Update the AuthPoint"})
	return
}
func (a *AuthPermitHandler) DeleteAuthPoint(c *gin.Context) {

	var req dto.DeleteAuthPointReDTO
	if err := c.ShouldBind(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	err := a.AuthPermitApplication.DeleteAuthPoint(req.AuthPointID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "successfully Delete the AuthPoint"})
	return
}
func (a *AuthPermitHandler) FindAuthPointByID(c *gin.Context) {
	var req dto.FindAuthPointByIDReDTO
	if err := c.ShouldBind(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	authPoint, err := a.AuthPermitApplication.FindAuthPointByID(req.AuthPointID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "successfully get the AuthPoint",
		"data":    authPoint,
	})
	return
}
func (a *AuthPermitHandler) FindAllAuthPoints(c *gin.Context) {
	authPoints, err := a.AuthPermitApplication.FindAllAuthPoints()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "successfully get all AuthPoints",
		"data":    authPoints,
	})
	return
}

func (a *AuthPermitHandler) SetAuthPointToRole(c *gin.Context) {

	var req []*dto.AuthPointRoleDTO
	if err := c.ShouldBind(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	err := a.AuthPermitApplication.SetAuthPointToRole(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "successfully Set the AuthPoint to role"})
	return
}
func (a *AuthPermitHandler) DeleteAuthPointToRole(c *gin.Context) {

	var req dto.DeleteRoleAuthReDTO
	if err := c.ShouldBind(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	err := a.AuthPermitApplication.DeleteAuthPointToRole(req.RoleAuthPointIDs)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "successfully Delete the AuthPoint from Role"})
	return
}
func (a *AuthPermitHandler) FindAuthPointsByRoleID(c *gin.Context) {
	var req dto.FindAuthPointByRoleID
	if err := c.ShouldBind(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	roleAuthPoints, err := a.AuthPermitApplication.FindAuthPointsByRoleID(req.RoleID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "successfully get AuthPoints of the Role",
		"data":    roleAuthPoints,
	})
	return
}

func (a *AuthPermitHandler) SetUserRoles(c *gin.Context) {
	var req []*dto.UserRoleDTO
	if err := c.ShouldBind(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	err := a.AuthPermitApplication.SetUserRoles(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "successfully Set role to user",
	})
	return
}
func (a *AuthPermitHandler) DeleteUserRoles(c *gin.Context) {
	var req dto.DeleteUserRoleReDTO
	if err := c.ShouldBind(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	err := a.AuthPermitApplication.DeleteUserRoles(req.UserRoleID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "successfully Delete the Roles",
	})
	return
}
func (a *AuthPermitHandler) FindUserRoleByID(c *gin.Context) {
	var req dto.FindUserRoleByIDReDTO
	if err := c.ShouldBind(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	userRoles, err := a.AuthPermitApplication.FindUserRoleByID(req.UserRoleID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "successfully get the UserRole",
		"data":    userRoles,
	})
	return
}
func (a *AuthPermitHandler) FindUserRoleByUserID(c *gin.Context) {
	userID, exist := c.Get("user_id")
	uiduint := userID.(uint)
	if !exist {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Can not find User ID"})
		return
	}
	userRoles, err := a.AuthPermitApplication.FindUserRoleByUserID(uiduint)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "successfully get the UserRoles",
		"data":    userRoles,
	})
	return
}
