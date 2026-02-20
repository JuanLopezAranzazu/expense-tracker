package services

import (
	"github.com/JuanLopezAranzazu/backend/internal/auth"
	"github.com/JuanLopezAranzazu/backend/internal/domain"
	"github.com/JuanLopezAranzazu/backend/internal/dto"
	apperrors "github.com/JuanLopezAranzazu/backend/internal/errors"
	"github.com/JuanLopezAranzazu/backend/internal/repository"

	"golang.org/x/crypto/bcrypt"
)

type AuthService struct {
	userRepo *repository.UserRepository
	jwtSvc   *auth.JWTService
}

func NewAuthService(userRepo *repository.UserRepository, jwtSvc *auth.JWTService) *AuthService {
	return &AuthService{userRepo: userRepo, jwtSvc: jwtSvc}
}

// Crear un nuevo usuario
func (s *AuthService) Register(req *dto.RegisterRequest) (*dto.AuthResponse, error) {
	hashed, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, apperrors.Internal(err)
	}

	user := &domain.User{
		Name:     req.Name,
		Email:    req.Email,
		Password: string(hashed),
	}

	if err := s.userRepo.Create(user); err != nil {
		return nil, err
	}

	token, err := s.jwtSvc.GenerateToken(user.ID, user.Email)
	if err != nil {
		return nil, apperrors.Internal(err)
	}

	return &dto.AuthResponse{
		Token: token,
		User:  toUserResponse(user),
	}, nil
}

// Iniciar sesión de un usuario existente
func (s *AuthService) Login(req *dto.LoginRequest) (*dto.AuthResponse, error) {
	user, err := s.userRepo.FindByEmail(req.Email)
	if err != nil {
		return nil, apperrors.Unauthorized("Credenciales inválidas")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		return nil, apperrors.Unauthorized("Credenciales inválidas")
	}

	token, err := s.jwtSvc.GenerateToken(user.ID, user.Email)
	if err != nil {
		return nil, apperrors.Internal(err)
	}

	return &dto.AuthResponse{
		Token: token,
		User:  toUserResponse(user),
	}, nil
}

func toUserResponse(u *domain.User) dto.UserResponse {
	return dto.UserResponse{
		ID:        u.ID,
		Name:      u.Name,
		Email:     u.Email,
		CreatedAt: u.CreatedAt,
	}
}
