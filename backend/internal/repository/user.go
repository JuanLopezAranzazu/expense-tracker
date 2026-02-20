package repository

import (
	"errors"

	"github.com/JuanLopezAranzazu/backend/internal/domain"
	apperrors "github.com/JuanLopezAranzazu/backend/internal/errors"

	"gorm.io/gorm"
)

type UserRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) *UserRepository {
	return &UserRepository{db: db}
}

// Crear un nuevo usuario en la base de datos
func (r *UserRepository) Create(user *domain.User) error {
	if err := r.db.Create(user).Error; err != nil {
		if isUniqueViolation(err) {
			return apperrors.Conflict("El correo electrónico ya está en uso")
		}
		return apperrors.Internal(err)
	}
	return nil
}

// Buscar un usuario por su correo electrónico
func (r *UserRepository) FindByEmail(email string) (*domain.User, error) {
	var user domain.User
	if err := r.db.Where("email = ?", email).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, apperrors.NotFound("El usuario no fue encontrado")
		}
		return nil, apperrors.Internal(err)
	}
	return &user, nil
}

// Buscar un usuario por su ID
func (r *UserRepository) FindByID(id string) (*domain.User, error) {
	var user domain.User
	if err := r.db.First(&user, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, apperrors.NotFound("El usuario no fue encontrado")
		}
		return nil, apperrors.Internal(err)
	}
	return &user, nil
}

// Actualizar la información de un usuario
func (r *UserRepository) Update(user *domain.User) error {
	if err := r.db.Save(user).Error; err != nil {
		if isUniqueViolation(err) {
			return apperrors.Conflict("El correo electrónico ya está en uso")
		}
		return apperrors.Internal(err)
	}
	return nil
}

// Actualizar la contraseña de un usuario
func (r *UserRepository) UpdatePassword(userID, hashedPassword string) error {
	if err := r.db.Model(&domain.User{}).
		Where("id = ?", userID).
		Update("password", hashedPassword).Error; err != nil {
		return apperrors.Internal(err)
	}
	return nil
}
