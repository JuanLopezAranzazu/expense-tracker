package repository

import (
	"errors"

	"github.com/JuanLopezAranzazu/backend/internal/domain"

	apperrors "github.com/JuanLopezAranzazu/backend/internal/errors"

	"gorm.io/gorm"
)

type TransactionRepository struct {
	db *gorm.DB
}

func NewTransactionRepository(db *gorm.DB) *TransactionRepository {
	return &TransactionRepository{db: db}
}

// Crear una nueva transacción
func (r *TransactionRepository) Create(tx *domain.Transaction) error {
	if err := r.db.Create(tx).Error; err != nil {
		return apperrors.Internal(err)
	}
	return nil
}

// Obtener todas las transacciones de un usuario
func (r *TransactionRepository) FindByUserID(userID string) ([]domain.Transaction, error) {
	var transactions []domain.Transaction
	if err := r.db.Where("user_id = ?", userID).Order("date DESC").Find(&transactions).Error; err != nil {
		return nil, apperrors.Internal(err)
	}
	return transactions, nil
}

// Obtener una transacción por su ID
func (r *TransactionRepository) FindByID(id, userID string) (*domain.Transaction, error) {
	var tx domain.Transaction
	if err := r.db.Where("id = ? AND user_id = ?", id, userID).First(&tx).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, apperrors.NotFound("La transacción no fue encontrada")
		}
		return nil, apperrors.Internal(err)
	}
	return &tx, nil
}

// Actualizar los detalles de una transacción
func (r *TransactionRepository) Update(tx *domain.Transaction) error {
	result := r.db.Model(tx).Where("id = ? AND user_id = ?", tx.ID, tx.UserID).
		Updates(map[string]interface{}{
			"account_id":  tx.AccountID,
			"category_id": tx.CategoryID,
			"type":        tx.Type,
			"amount":      tx.Amount,
			"description": tx.Description,
			"date":        tx.Date,
		})
	if result.Error != nil {
		return apperrors.Internal(result.Error)
	}
	if result.RowsAffected == 0 {
		return apperrors.NotFound("La transacción no fue encontrada")
	}
	return nil
}

// Eliminar una transacción
func (r *TransactionRepository) Delete(id, userID string) (*domain.Transaction, error) {
	tx, err := r.FindByID(id, userID)
	if err != nil {
		return nil, err
	}
	if err := r.db.Delete(tx).Error; err != nil {
		return nil, apperrors.Internal(err)
	}
	return tx, nil
}
