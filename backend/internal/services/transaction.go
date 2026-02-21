package services

import (
	"github.com/JuanLopezAranzazu/backend/internal/domain"
	"github.com/JuanLopezAranzazu/backend/internal/dto"
	apperrors "github.com/JuanLopezAranzazu/backend/internal/errors"
	"github.com/JuanLopezAranzazu/backend/internal/repository"

	"time"
)

type TransactionService struct {
	txRepo  *repository.TransactionRepository
	accRepo *repository.AccountRepository
}

func NewTransactionService(
	txRepo *repository.TransactionRepository,
	accRepo *repository.AccountRepository,
) *TransactionService {
	return &TransactionService{txRepo: txRepo, accRepo: accRepo}
}

// Crear una nueva transacción
func (s *TransactionService) Create(userID string, req *dto.CreateTransactionRequest) (*dto.TransactionResponse, error) {
	if _, err := s.accRepo.FindByID(req.AccountID, userID); err != nil {
		return nil, err
	}

	date, err := time.Parse("2006-01-02", req.Date)
	if err != nil {
		return nil, apperrors.BadRequest("El formato de fecha es inválido, use YYYY-MM-DD")
	}

	tx := &domain.Transaction{
		UserID:      userID,
		AccountID:   req.AccountID,
		CategoryID:  req.CategoryID,
		Type:        req.Type,
		Amount:      req.Amount,
		Description: req.Description,
		Date:        date,
	}

	if err := s.txRepo.Create(tx); err != nil {
		return nil, err
	}

	delta := req.Amount
	if req.Type == "expense" {
		delta = -req.Amount
	}
	_ = s.accRepo.UpdateBalance(req.AccountID, delta)

	resp := toTransactionResponse(tx)
	return &resp, nil
}

// Obtener todas las transacciones de un usuario
func (s *TransactionService) GetAll(userID string) ([]dto.TransactionResponse, error) {
	transactions, err := s.txRepo.FindByUserID(userID)
	if err != nil {
		return nil, err
	}
	result := make([]dto.TransactionResponse, len(transactions))
	for i, t := range transactions {
		result[i] = toTransactionResponse(&t)
	}
	return result, nil
}

// Obtener una transacción por su ID
func (s *TransactionService) GetByID(id, userID string) (*dto.TransactionResponse, error) {
	tx, err := s.txRepo.FindByID(id, userID)
	if err != nil {
		return nil, err
	}
	resp := toTransactionResponse(tx)
	return &resp, nil
}

// Actualizar los detalles de una transacción
func (s *TransactionService) Update(id, userID string, req *dto.UpdateTransactionRequest) (*dto.TransactionResponse, error) {
	tx, err := s.txRepo.FindByID(id, userID)
	if err != nil {
		return nil, err
	}

	oldDelta := tx.Amount
	if tx.Type == "expense" {
		oldDelta = -tx.Amount
	}
	_ = s.accRepo.UpdateBalance(tx.AccountID, -oldDelta)

	if req.AccountID != "" {
		if _, err := s.accRepo.FindByID(req.AccountID, userID); err != nil {
			return nil, err
		}
		tx.AccountID = req.AccountID
	}
	if req.CategoryID != nil {
		tx.CategoryID = req.CategoryID
	}
	if req.Type != "" {
		tx.Type = req.Type
	}
	if req.Amount > 0 {
		tx.Amount = req.Amount
	}
	if req.Description != nil {
		tx.Description = req.Description
	}
	if req.Date != "" {
		date, err := time.Parse("2006-01-02", req.Date)
		if err != nil {
			return nil, apperrors.BadRequest("El formato de fecha es inválido, use YYYY-MM-DD")
		}
		tx.Date = date
	}

	if err := s.txRepo.Update(tx); err != nil {
		return nil, err
	}

	newDelta := tx.Amount
	if tx.Type == "expense" {
		newDelta = -tx.Amount
	}
	_ = s.accRepo.UpdateBalance(tx.AccountID, newDelta)

	resp := toTransactionResponse(tx)
	return &resp, nil
}

// Eliminar una transacción
func (s *TransactionService) Delete(id, userID string) error {
	tx, err := s.txRepo.Delete(id, userID)
	if err != nil {
		return err
	}

	delta := tx.Amount
	if tx.Type == "expense" {
		delta = -tx.Amount
	}
	_ = s.accRepo.UpdateBalance(tx.AccountID, -delta)
	return nil
}

func toTransactionResponse(t *domain.Transaction) dto.TransactionResponse {
	return dto.TransactionResponse{
		ID:          t.ID,
		UserID:      t.UserID,
		AccountID:   t.AccountID,
		CategoryID:  t.CategoryID,
		Type:        t.Type,
		Amount:      t.Amount,
		Description: t.Description,
		Date:        t.Date,
		CreatedAt:   t.CreatedAt,
	}
}
