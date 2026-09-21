package middleware

import (
	"net/http"
	"strings"

	apperrors "github.com/JuanLopezAranzazu/backend/internal/errors"

	"github.com/JuanLopezAranzazu/backend/internal/auth"

	"github.com/gin-gonic/gin"
)

const UserIDKey = "userID"
const UserEmailKey = "userEmail"

func AuthMiddleware(jwtSvc *auth.JWTService) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, apperrors.Unauthorized("El token de autorización es requerido"))
			return
		}

		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, apperrors.Unauthorized("Formato de token no válido"))
			return
		}

		claims, err := jwtSvc.ValidateToken(parts[1])
		if err != nil {
			if appErr, ok := err.(*apperrors.AppError); ok {
				c.AbortWithStatusJSON(appErr.Code, appErr)
				return
			}
			c.AbortWithStatusJSON(http.StatusUnauthorized, apperrors.Unauthorized("Token no válido"))
			return
		}

		c.Set(UserIDKey, claims.UserID)
		c.Set(UserEmailKey, claims.Email)
		c.Next()
	}
}

func GetUserID(c *gin.Context) string {
	return c.GetString(UserIDKey)
}

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Origin, Content-Type, Authorization")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}
		c.Next()
	}
}
