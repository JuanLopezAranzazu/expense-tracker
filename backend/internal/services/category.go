package services

import (
	"github.com/JuanLopezAranzazu/backend/internal/domain"
	"github.com/JuanLopezAranzazu/backend/internal/dto"
	"github.com/JuanLopezAranzazu/backend/internal/repository"
)

type CategoryService struct {
	repo *repository.CategoryRepository
}

func NewCategoryService(repo *repository.CategoryRepository) *CategoryService {
	return &CategoryService{repo: repo}
}

// Crear una nueva categoría
func (s *CategoryService) Create(userID string, req *dto.CreateCategoryRequest) (*dto.CategoryResponse, error) {
	cat := &domain.Category{
		UserID: &userID,
		Name:   req.Name,
		Type:   req.Type,
	}
	if err := s.repo.Create(cat); err != nil {
		return nil, err
	}
	resp := toCategoryResponse(cat)
	return &resp, nil
}

// Obtener todas las categorías para un usuario
func (s *CategoryService) GetAll(userID string) ([]dto.CategoryResponse, error) {
	cats, err := s.repo.FindByUserID(userID)
	if err != nil {
		return nil, err
	}
	result := make([]dto.CategoryResponse, len(cats))
	for i, c := range cats {
		result[i] = toCategoryResponse(&c)
	}
	return result, nil
}

// Obtener una categoría por su ID
func (s *CategoryService) GetByID(id, userID string) (*dto.CategoryResponse, error) {
	cat, err := s.repo.FindByID(id, userID)
	if err != nil {
		return nil, err
	}
	resp := toCategoryResponse(cat)
	return &resp, nil
}

// Actualizar una categoría existente
func (s *CategoryService) Update(id, userID string, req *dto.UpdateCategoryRequest) (*dto.CategoryResponse, error) {
	cat, err := s.repo.FindByID(id, userID)
	if err != nil {
		return nil, err
	}

	if req.Name != "" {
		cat.Name = req.Name
	}

	if req.Type != "" {
		cat.Type = req.Type
	}

	if err := s.repo.Update(cat); err != nil {
		return nil, err
	}
	resp := toCategoryResponse(cat)
	return &resp, nil
}

// Eliminar una categoría por su ID
func (s *CategoryService) Delete(id, userID string) error {
	return s.repo.Delete(id, userID)
}

func toCategoryResponse(c *domain.Category) dto.CategoryResponse {
	return dto.CategoryResponse{
		ID:        c.ID,
		UserID:    c.UserID,
		Name:      c.Name,
		Type:      c.Type,
		CreatedAt: c.CreatedAt,
	}
}
