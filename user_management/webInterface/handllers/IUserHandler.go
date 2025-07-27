package handllers

import (
	"MScProject/auth_management/token/base_Interface"
	"MScProject/user_management/application"
	"github.com/gin-gonic/gin"
	"net/http"
	"strings"
)

type IUserHandler interface {
	Register(c *gin.Context)
	Login(c *gin.Context)
	Logout(c *gin.Context)
	LogOff(c *gin.Context)
	ChangeUserPassword(c *gin.Context)
	AdminRestPassword(c *gin.Context)
	GetUserInfo(c *gin.Context)
}

type UserHandler struct {
	UserApplication application.IUserApplication
	AuthToken       base_Interface.IToken[string]
}

func NewUserHandler(userapplication application.IUserApplication, authtoken base_Interface.IToken[string]) *UserHandler {
	return &UserHandler{userapplication, authtoken}
}

func (h *UserHandler) Register(c *gin.Context) {
	var req RegisterRequest
	if err := c.ShouldBind(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	err := h.UserApplication.Register(req.Username, req.Password, req.Email)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "register success"})
	return
}

func (h *UserHandler) Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBind(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	uid, err := h.UserApplication.Login(req.Username, req.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err})
		return
	}

	tk, err := h.AuthToken.GenerateToken(&base_Interface.Userinfo{uid, req.Username})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"token":   tk,
		"message": "login success",
	})
}
func (h *UserHandler) Logout(c *gin.Context) {
	authHeader := c.GetHeader("Authorization")
	if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid Token type"})
		return
	}
	token := strings.TrimPrefix(authHeader, "Bearer ")
	err := h.AuthToken.ExpireToken(token)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "logout success",
	})
	return
}
func (h *UserHandler) LogOff(c *gin.Context) {
	var req LogoffRequest
	if err := c.ShouldBind(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	uid, exist := c.Get("user_id")
	uiduint := uid.(uint)
	if !exist {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Can not find User ID"})
		return
	}
	err := h.UserApplication.LogOff(uiduint, req.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	authHeader := c.GetHeader("Authorization")
	if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid Token type"})
		return
	}
	token := strings.TrimPrefix(authHeader, "Bearer ")
	err = h.AuthToken.ExpireToken(token)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "logoff success",
	})
}
func (h *UserHandler) ChangeUserPassword(c *gin.Context) {
	var req ChangeUserPasswordRequest
	if err := c.ShouldBind(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	uid, exist := c.Get("user_id")
	uiduint := uid.(uint)
	if !exist {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Can not find User ID"})
		return
	}
	err := h.UserApplication.ChangeUserPassword(uiduint, req.OldPassword, req.NewPassword)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "Password has been changed",
	})
}
func (h *UserHandler) AdminRestPassword(c *gin.Context) {
	var req AdminResetPasswordRequest
	if err := c.ShouldBind(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	err := h.UserApplication.AdminRestPassword(req.Username, req.NewPassword)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "Password has been changed",
	})
}

func (h *UserHandler) GetUserInfo(c *gin.Context) {
	uid, exist := c.Get("user_id")
	uiduint := uid.(uint)
	if !exist {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Can not find User ID"})
		return
	}
	username, email, err := h.UserApplication.GetUserInfo(uiduint)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	}
	c.JSON(http.StatusOK, gin.H{
		"username": username,
		"email":    email,
	})
}
