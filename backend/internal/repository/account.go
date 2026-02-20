package repository

import (
	"errors"

	"github.com/JuanLopezAranzazu/backend/internal/domain"
	apperrors "github.com/JuanLopezAranzazu/backend/internal/errors"

	"gorm.io/gorm"
)

type AccountRepository struct {
	db *gorm.DB
}

func NewAccountRepository(db *gorm.DB) *AccountRepository {
	return &AccountRepository{db: db}
}

// Crear una nueva cuenta
func (r *AccountRepository) Create(acc *domain.Account) error {
	if err := r.db.Create(acc).Error; err != nil {
		return apperrors.Internal(err)
	}
	return nil
}

// Obtener todas las cuentas de un usuario
func (r *AccountRepository) FindByUserID(userID string) ([]domain.Account, error) {
	var accounts []domain.Account
	if err := r.db.Where("user_id = ?", userID).Order("name").Find(&accounts).Error; err != nil {
		return nil, apperrors.Internal(err)
	}
	return accounts, nil
}

// Obtener una cuenta por su ID
func (r *AccountRepository) FindByID(id, userID string) (*domain.Account, error) {
	var acc domain.Account
	if err := r.db.Where("id = ? AND user_id = ?", id, userID).First(&acc).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, apperrors.NotFound("La cuenta no fue encontrada")
		}
		return nil, apperrors.Internal(err)
	}
	return &acc, nil
}

// Actualizar los detalles de una cuenta
func (r *AccountRepository) Update(acc *domain.Account) error {
	result := r.db.Model(acc).Where("id = ? AND user_id = ?", acc.ID, acc.UserID).
		Updates(map[string]interface{}{
			"name":        acc.Name,
			"type":        acc.Type,
			"currency":    acc.Currency,
			"description": acc.Description,
		})
	if result.Error != nil {
		return apperrors.Internal(result.Error)
	}
	if result.RowsAffected == 0 {
		return apperrors.NotFound("La cuenta no fue encontrada")
	}
	return nil
}

// Actualizar el balance de una cuenta
func (r *AccountRepository) UpdateBalance(id string, delta float64) error {
	if err := r.db.Model(&domain.Account{}).
		Where("id = ?", id).
		UpdateColumn("balance", gorm.Expr("balance + ?", delta)).Error; err != nil {
		return apperrors.Internal(err)
	}
	return nil
}

// Eliminar una cuenta
func (r *AccountRepository) Delete(id, userID string) error {
	result := r.db.Where("id = ? AND user_id = ?", id, userID).Delete(&domain.Account{})
	if result.Error != nil {
		return apperrors.Internal(result.Error)
	}
	if result.RowsAffected == 0 {
		return apperrors.NotFound("La cuenta no fue encontrada")
	}
	return nil
}
