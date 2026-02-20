package dto

import "time"

type RegisterRequest struct {
	Name     string `json:"name" binding:"required,min=2,max=100"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}

type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type AuthResponse struct {
	Token string       `json:"token"`
	User  UserResponse `json:"user"`
}

type UserResponse struct {
	ID        string    `json:"id"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	CreatedAt time.Time `json:"created_at"`
}

type UpdateUserRequest struct {
	Name  string `json:"name" binding:"omitempty,min=2,max=100"`
	Email string `json:"email" binding:"omitempty,email"`
}

type ChangePasswordRequest struct {
	OldPassword string `json:"old_password" binding:"required"`
	NewPassword string `json:"new_password" binding:"required,min=6"`
}

type CreateCategoryRequest struct {
	Name  string  `json:"name" binding:"required,min=1,max=100"`
	Color *string `json:"color"`
	Icon  *string `json:"icon"`
	Type  string  `json:"type" binding:"required,oneof=income expense"`
}

type UpdateCategoryRequest struct {
	Name string `json:"name" binding:"omitempty,min=1,max=100"`
	Type string `json:"type" binding:"omitempty,oneof=income expense"`
}

type CategoryResponse struct {
	ID        string    `json:"id"`
	UserID    *string   `json:"user_id"`
	Name      string    `json:"name"`
	Type      string    `json:"type"`
	CreatedAt time.Time `json:"created_at"`
}

type MessageResponse struct {
	Message string `json:"message"`
}
