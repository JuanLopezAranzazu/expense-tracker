package handlers

import (
	"net/http"

	apperrors "github.com/JuanLopezAranzazu/backend/internal/errors"

	"github.com/gin-gonic/gin"
)

func respondOK(c *gin.Context, data interface{}) {
	c.JSON(http.StatusOK, data)
}

func respondCreated(c *gin.Context, data interface{}) {
	c.JSON(http.StatusCreated, data)
}

func respondNoContent(c *gin.Context) {
	c.Status(http.StatusNoContent)
}

func handleError(c *gin.Context, err error) {
	if appErr, ok := err.(*apperrors.AppError); ok {
		c.JSON(appErr.Code, gin.H{"message": appErr.Message})
		return
	}
	c.JSON(http.StatusInternalServerError, gin.H{"message": "Error interno del servidor"})
}
