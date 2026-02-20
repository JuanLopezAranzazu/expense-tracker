package repository

import (
	"errors"

	"github.com/JuanLopezAranzazu/backend/internal/domain"
	apperrors "github.com/JuanLopezAranzazu/backend/internal/errors"

	"gorm.io/gorm"
)

type CategoryRepository struct {
	db *gorm.DB
}

func NewCategoryRepository(db *gorm.DB) *CategoryRepository {
	return &CategoryRepository{db: db}
}

// Crear una nueva categoría
func (r *CategoryRepository) Create(cat *domain.Category) error {
	if err := r.db.Create(cat).Error; err != nil {
		return apperrors.Internal(err)
	}
	return nil
}

// Obtener todas las categorías para un usuario
func (r *CategoryRepository) FindByUserID(userID string) ([]domain.Category, error) {
	var cats []domain.Category
	if err := r.db.Where("user_id = ? OR user_id IS NULL", userID).
		Order("name").Find(&cats).Error; err != nil {
		return nil, apperrors.Internal(err)
	}
	return cats, nil
}

// Obtener una categoría por su ID
func (r *CategoryRepository) FindByID(id, userID string) (*domain.Category, error) {
	var cat domain.Category
	err := r.db.Where("id = ? AND (user_id = ? OR user_id IS NULL)", id, userID).
		First(&cat).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, apperrors.NotFound("La categoría no fue encontrada")
		}
		return nil, apperrors.Internal(err)
	}
	return &cat, nil
}

// Actualizar una categoría existente
func (r *CategoryRepository) Update(cat *domain.Category) error {
	result := r.db.Model(cat).Where("id = ? AND user_id = ?", cat.ID, cat.UserID).
		Updates(map[string]interface{}{
			"name": cat.Name,
			"type": cat.Type,
		})
	if result.Error != nil {
		return apperrors.Internal(result.Error)
	}
	if result.RowsAffected == 0 {
		return apperrors.NotFound("La categoría no fue encontrada")
	}
	return nil
}

// Eliminar una categoría por su ID
func (r *CategoryRepository) Delete(id, userID string) error {
	result := r.db.Where("id = ? AND user_id = ?", id, userID).Delete(&domain.Category{})
	if result.Error != nil {
		return apperrors.Internal(result.Error)
	}
	if result.RowsAffected == 0 {
		return apperrors.NotFound("La categoría no fue encontrada")
	}
	return nil
}
