package handlers

import (
	"net/http"

	"github.com/JuanLopezAranzazu/backend/internal/dto"
	"github.com/JuanLopezAranzazu/backend/internal/services"

	"github.com/gin-gonic/gin"
)

type AuthHandler struct {
	svc *services.AuthService
}

func NewAuthHandler(svc *services.AuthService) *AuthHandler {
	return &AuthHandler{svc: svc}
}

func (h *AuthHandler) Register(c *gin.Context) {
	var req dto.RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	resp, err := h.svc.Register(&req)
	if err != nil {
		handleError(c, err)
		return
	}
	respondCreated(c, resp)
}

func (h *AuthHandler) Login(c *gin.Context) {
	var req dto.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	resp, err := h.svc.Login(&req)
	if err != nil {
		handleError(c, err)
		return
	}
	respondOK(c, resp)
}
