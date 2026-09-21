package services

import (
	"github.com/JuanLopezAranzazu/backend/internal/domain"
	"github.com/JuanLopezAranzazu/backend/internal/dto"
	"github.com/JuanLopezAranzazu/backend/internal/repository"
)

type AccountService struct {
	repo *repository.AccountRepository
}

func NewAccountService(repo *repository.AccountRepository) *AccountService {
	return &AccountService{repo: repo}
}

// Crear una nueva cuenta para un usuario
func (s *AccountService) Create(userID string, req *dto.CreateAccountRequest) (*dto.AccountResponse, error) {
	acc := &domain.Account{
		UserID:      userID,
		Name:        req.Name,
		Type:        req.Type,
		Balance:     req.Balance,
		Currency:    req.Currency,
		Description: req.Description,
	}
	if err := s.repo.Create(acc); err != nil {
		return nil, err
	}
	resp := toAccountResponse(acc)
	return &resp, nil
}

// Obtener todas las cuentas de un usuario
func (s *AccountService) GetAll(userID string) ([]dto.AccountResponse, error) {
	accounts, err := s.repo.FindByUserID(userID)
	if err != nil {
		return nil, err
	}
	result := make([]dto.AccountResponse, len(accounts))
	for i, a := range accounts {
		result[i] = toAccountResponse(&a)
	}
	return result, nil
}

// Obtener una cuenta por su ID
func (s *AccountService) GetByID(id, userID string) (*dto.AccountResponse, error) {
	acc, err := s.repo.FindByID(id, userID)
	if err != nil {
		return nil, err
	}
	resp := toAccountResponse(acc)
	return &resp, nil
}

// Actualizar una cuenta existente
func (s *AccountService) Update(id, userID string, req *dto.UpdateAccountRequest) (*dto.AccountResponse, error) {
	acc, err := s.repo.FindByID(id, userID)
	if err != nil {
		return nil, err
	}

	if req.Name != "" {
		acc.Name = req.Name
	}
	if req.Type != "" {
		acc.Type = req.Type
	}
	if req.Currency != "" {
		acc.Currency = req.Currency
	}
	if req.Description != nil {
		acc.Description = req.Description
	}

	if err := s.repo.Update(acc); err != nil {
		return nil, err
	}
	resp := toAccountResponse(acc)
	return &resp, nil
}

// Eliminar una cuenta
func (s *AccountService) Delete(id, userID string) error {
	return s.repo.Delete(id, userID)
}

func toAccountResponse(a *domain.Account) dto.AccountResponse {
	return dto.AccountResponse{
		ID:          a.ID,
		UserID:      a.UserID,
		Name:        a.Name,
		Type:        a.Type,
		Balance:     a.Balance,
		Currency:    a.Currency,
		Description: a.Description,
		CreatedAt:   a.CreatedAt,
		UpdatedAt:   a.UpdatedAt,
	}
}
