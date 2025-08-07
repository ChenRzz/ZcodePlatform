package middleware

import (
	"MScProject/authentication/token/base_Interface"
	"github.com/gin-gonic/gin"
	"net/http"
	"strings"
)

type AuthMiddleWare struct {
	authToken base_Interface.IToken[string]
}

func NewAuthMiddleWare(authtoken base_Interface.IToken[string]) *AuthMiddleWare {
	return &AuthMiddleWare{authtoken}
}

func (a *AuthMiddleWare) CheckToken() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid Token type"})
			c.Abort()
			return
		}
		token := strings.TrimPrefix(authHeader, "Bearer ")
		userinfo, err := a.authToken.CheckParseToken(token)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			c.Abort()
			return
		}
		if userinfo == nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token payload"})
			c.Abort()
			return
		}
		c.Set("user_id", userinfo.UserIDInfo)
		c.Set("username", userinfo.UsernameInfo)
		c.Set("Zcode", userinfo.UserZcodeInfo)
		c.Next()
	}
}
