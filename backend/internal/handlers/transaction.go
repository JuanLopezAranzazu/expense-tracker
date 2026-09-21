package handlers

import (
	"net/http"

	"github.com/JuanLopezAranzazu/backend/internal/dto"
	"github.com/JuanLopezAranzazu/backend/internal/middleware"
	"github.com/JuanLopezAranzazu/backend/internal/services"

	"github.com/gin-gonic/gin"
)

type TransactionHandler struct {
	svc *services.TransactionService
}

func NewTransactionHandler(svc *services.TransactionService) *TransactionHandler {
	return &TransactionHandler{svc: svc}
}

func (h *TransactionHandler) Create(c *gin.Context) {
	var req dto.CreateTransactionRequest
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

func (h *TransactionHandler) GetAll(c *gin.Context) {
	userID := middleware.GetUserID(c)
	resp, err := h.svc.GetAll(userID)
	if err != nil {
		handleError(c, err)
		return
	}
	respondOK(c, resp)
}

func (h *TransactionHandler) GetByID(c *gin.Context) {
	userID := middleware.GetUserID(c)
	resp, err := h.svc.GetByID(c.Param("id"), userID)
	if err != nil {
		handleError(c, err)
		return
	}
	respondOK(c, resp)
}

func (h *TransactionHandler) Update(c *gin.Context) {
	var req dto.UpdateTransactionRequest
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

func (h *TransactionHandler) Delete(c *gin.Context) {
	userID := middleware.GetUserID(c)
	if err := h.svc.Delete(c.Param("id"), userID); err != nil {
		handleError(c, err)
		return
	}
	respondNoContent(c)
}
