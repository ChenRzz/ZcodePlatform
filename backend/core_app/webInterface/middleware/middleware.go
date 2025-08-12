package middleware

import (
	"MScProject/authentication/rbac"
	"MScProject/authentication/token/base_Interface"
	"github.com/gin-gonic/gin"
	"net/http"
	"strings"
)

type AuthMiddleWare struct {
	authToken   base_Interface.IToken[string]
	rBacService rbac.IRbacService
}

func NewAuthMiddleWare(authtoken base_Interface.IToken[string], rbacservice rbac.IRbacService) *AuthMiddleWare {
	return &AuthMiddleWare{authtoken, rbacservice}
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

func (a *AuthMiddleWare) CheckPermissions() gin.HandlerFunc {
	return func(c *gin.Context) {
		userID, exist := c.Get("user_id")
		if !exist {
			c.JSON(http.StatusBadRequest, gin.H{"error": "could not find the user ID from token"})
			c.Abort()
			return
		}
		userid := userID.(uint)
		userPerm, err := a.rBacService.GetUserAuthPoints(userid)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			c.Abort()
			return
		}

		apiUrl := rbac.UrlInfo{
			RequestMethod: c.Request.Method,
			RequestPath:   c.Request.URL.Path,
		}
		pass := a.rBacService.CheckUserAuthPoint(userPerm, apiUrl)
		if !pass {
			c.JSON(http.StatusMethodNotAllowed, gin.H{"error": "insufficient auth.ts"})
			c.Abort()
			return
		}
		c.Next()
	}
}
