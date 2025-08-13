package handllers

import (
	"MScProject/authentication/token/base_Interface"
	"MScProject/core_app/application"
	"MScProject/core_app/dto/request"
	"MScProject/core_app/infrastructure"
	"fmt"
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
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
	FindByUserZCode(c *gin.Context)
	FindByUserZCodeInput(c *gin.Context)
}

type UserHandler struct {
	UserApplication application.IUserApplication
	AuthToken       base_Interface.IToken[string]
}

func NewUserHandler(userapplication application.IUserApplication, authtoken base_Interface.IToken[string]) *UserHandler {
	return &UserHandler{userapplication, authtoken}
}

func (h *UserHandler) Register(c *gin.Context) {
	var req request.RegisterRequest
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
	var req request.LoginRequest
	if err := c.ShouldBind(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	uid, uzcode, err := h.UserApplication.Login(req.Username, req.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err})
		return
	}
	tk, err := h.AuthToken.GenerateToken(&base_Interface.Userinfo{uid, uzcode, req.Username})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	sql := `SELECT r.role_name
FROM user_role ur
JOIN roles r ON ur.role_id = r.id
WHERE ur.user_id = ?`
	var roleNames []string
	db := infrastructure.GetDB()
	err = db.Raw(sql, uid).Scan(&roleNames).Error
	if err != nil {
		fmt.Println("failed to get user's roles:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"token":     tk,
		"message":   "login success",
		"username":  req.Username,
		"userZcode": strconv.FormatUint(uzcode, 10),
		"user_role": roleNames, //[]string
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
	var req request.LogoffRequest
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
	var req request.ChangeUserPasswordRequest
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
	var req request.AdminResetPasswordRequest
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
	userinfo, err := h.UserApplication.GetUserInfo(uiduint)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "successfully find the user",
		"data":    userinfo,
	})
}

func (h *UserHandler) FindByUserZCode(c *gin.Context) {
	uzcode, exist := c.Get("Zcode")
	uzcodeuint := uzcode.(uint64)
	if !exist {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Can not find User ZCode"})
		return
	}
	usr, err := h.UserApplication.FindByUserZCode(uzcodeuint)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	var usrInfo request.UserinfoDTO
	usrInfo.UserID = usr.ID
	usrInfo.UserName = usr.Username
	usrInfo.UserEmail = usr.Email
	usrInfo.UserZCode = usr.ZCodeID
	c.JSON(http.StatusOK, gin.H{
		"message": "successfully find the user",
		"data":    usrInfo,
	})
}
func (h *UserHandler) FindByUserZCodeInput(c *gin.Context) {
	var req request.FindByUserZCodeInputRequest
	if err := c.ShouldBind(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	usr, err := h.UserApplication.FindByUserZCode(req.UserZcodeID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	var usrInfo request.UserinfoDTO
	usrInfo.UserID = usr.ID
	usrInfo.UserName = usr.Username
	usrInfo.UserEmail = usr.Email
	usrInfo.UserZCode = usr.ZCodeID
	c.JSON(http.StatusOK, gin.H{
		"message": "successfully find the user",
		"data":    usrInfo,
	})
}
