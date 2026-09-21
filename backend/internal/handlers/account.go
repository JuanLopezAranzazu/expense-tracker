package handlers

import (
	"net/http"

	"github.com/JuanLopezAranzazu/backend/internal/dto"
	"github.com/JuanLopezAranzazu/backend/internal/middleware"
	"github.com/JuanLopezAranzazu/backend/internal/services"
	"github.com/gin-gonic/gin"
)

type AccountHandler struct {
	svc *services.AccountService
}

func NewAccountHandler(svc *services.AccountService) *AccountHandler {
	return &AccountHandler{svc: svc}
}

func (h *AccountHandler) Create(c *gin.Context) {
	var req dto.CreateAccountRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}
	userID := middleware.GetUserID(c)
	resp, err := h.svc.Create(userID, &req)
	if err != nil {
		handleError(c, err)
		return
	}
	respondCreated(c, resp)
}

func (h *AccountHandler) GetAll(c *gin.Context) {
	userID := middleware.GetUserID(c)
	resp, err := h.svc.GetAll(userID)
	if err != nil {
		handleError(c, err)
		return
	}
	respondOK(c, resp)
}

func (h *AccountHandler) GetByID(c *gin.Context) {
	userID := middleware.GetUserID(c)
	resp, err := h.svc.GetByID(c.Param("id"), userID)
	if err != nil {
		handleError(c, err)
		return
	}
	respondOK(c, resp)
}

func (h *AccountHandler) Update(c *gin.Context) {
	var req dto.UpdateAccountRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}
	userID := middleware.GetUserID(c)
	resp, err := h.svc.Update(c.Param("id"), userID, &req)
	if err != nil {
		handleError(c, err)
		return
	}
	respondOK(c, resp)
}

func (h *AccountHandler) Delete(c *gin.Context) {
	userID := middleware.GetUserID(c)
	if err := h.svc.Delete(c.Param("id"), userID); err != nil {
		handleError(c, err)
		return
	}
	respondNoContent(c)
}
