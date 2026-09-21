package handlers

import (
	"net/http"

	"github.com/JuanLopezAranzazu/backend/internal/middleware"
	"github.com/JuanLopezAranzazu/backend/internal/services"

	"github.com/JuanLopezAranzazu/backend/internal/dto"

	"github.com/gin-gonic/gin"
)

type UserHandler struct {
	svc *services.UserService
}

func NewUserHandler(svc *services.UserService) *UserHandler {
	return &UserHandler{svc: svc}
}

func (h *UserHandler) GetProfile(c *gin.Context) {
	userID := middleware.GetUserID(c)
	resp, err := h.svc.GetProfile(userID)
	if err != nil {
		handleError(c, err)
		return
	}
	respondOK(c, resp)
}

func (h *UserHandler) UpdateProfile(c *gin.Context) {
	var req dto.UpdateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}
	userID := middleware.GetUserID(c)
	resp, err := h.svc.UpdateProfile(userID, &req)
	if err != nil {
		handleError(c, err)
		return
	}
	respondOK(c, resp)
}

func (h *UserHandler) ChangePassword(c *gin.Context) {
	var req dto.ChangePasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}
	userID := middleware.GetUserID(c)
	if err := h.svc.ChangePassword(userID, &req); err != nil {
		handleError(c, err)
		return
	}
	respondOK(c, dto.MessageResponse{Message: "Contraseña actualizada exitosamente"})
}
