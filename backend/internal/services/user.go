package services

import (
	"github.com/JuanLopezAranzazu/backend/internal/dto"
	apperrors "github.com/JuanLopezAranzazu/backend/internal/errors"
	"github.com/JuanLopezAranzazu/backend/internal/repository"

	"golang.org/x/crypto/bcrypt"
)

type UserService struct {
	userRepo *repository.UserRepository
}

func NewUserService(userRepo *repository.UserRepository) *UserService {
	return &UserService{userRepo: userRepo}
}

// Obtener el perfil del usuario
func (s *UserService) GetProfile(userID string) (*dto.UserResponse, error) {
	user, err := s.userRepo.FindByID(userID)
	if err != nil {
		return nil, err
	}
	resp := toUserResponse(user)
	return &resp, nil
}

// Actualizar el perfil del usuario
func (s *UserService) UpdateProfile(userID string, req *dto.UpdateUserRequest) (*dto.UserResponse, error) {
	user, err := s.userRepo.FindByID(userID)
	if err != nil {
		return nil, err
	}

	if req.Name != "" {
		user.Name = req.Name
	}
	if req.Email != "" {
		user.Email = req.Email
	}

	if err := s.userRepo.Update(user); err != nil {
		return nil, err
	}

	resp := toUserResponse(user)
	return &resp, nil
}

// Cambiar la contraseña del usuario
func (s *UserService) ChangePassword(userID string, req *dto.ChangePasswordRequest) error {
	user, err := s.userRepo.FindByID(userID)
	if err != nil {
		return err
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.OldPassword)); err != nil {
		return apperrors.BadRequest("Contraseña actual incorrecta")
	}

	hashed, err := bcrypt.GenerateFromPassword([]byte(req.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		return apperrors.Internal(err)
	}

	return s.userRepo.UpdatePassword(userID, string(hashed))
}
