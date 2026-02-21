package dto

import "time"

// Autenticación
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

// Usuarios
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

// Categorías
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

// Cuentas
type CreateAccountRequest struct {
	Name        string  `json:"name" binding:"required,min=1,max=100"`
	Type        string  `json:"type" binding:"required,oneof=cash bank credit savings investment"`
	Balance     float64 `json:"balance"`
	Currency    string  `json:"currency" binding:"required,len=3"`
	Description *string `json:"description"`
}

type UpdateAccountRequest struct {
	Name        string  `json:"name" binding:"omitempty,min=1,max=100"`
	Type        string  `json:"type" binding:"omitempty,oneof=cash bank credit savings investment"`
	Currency    string  `json:"currency" binding:"omitempty,len=3"`
	Description *string `json:"description"`
}

type AccountResponse struct {
	ID          string    `json:"id"`
	UserID      string    `json:"user_id"`
	Name        string    `json:"name"`
	Type        string    `json:"type"`
	Balance     float64   `json:"balance"`
	Currency    string    `json:"currency"`
	Description *string   `json:"description,omitempty"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// Transacciones
type CreateTransactionRequest struct {
	AccountID   string  `json:"account_id" binding:"required,uuid"`
	CategoryID  *string `json:"category_id" binding:"omitempty,uuid"`
	Type        string  `json:"type" binding:"required,oneof=income expense transfer"`
	Amount      float64 `json:"amount" binding:"required,gt=0"`
	Description *string `json:"description"`
	Date        string  `json:"date" binding:"required"`
}

type UpdateTransactionRequest struct {
	AccountID   string  `json:"account_id" binding:"omitempty,uuid"`
	CategoryID  *string `json:"category_id" binding:"omitempty,uuid"`
	Type        string  `json:"type" binding:"omitempty,oneof=income expense transfer"`
	Amount      float64 `json:"amount" binding:"omitempty,gt=0"`
	Description *string `json:"description"`
	Date        string  `json:"date"`
}

type TransactionResponse struct {
	ID          string    `json:"id"`
	UserID      string    `json:"user_id"`
	AccountID   string    `json:"account_id"`
	CategoryID  *string   `json:"category_id,omitempty"`
	Type        string    `json:"type"`
	Amount      float64   `json:"amount"`
	Description *string   `json:"description,omitempty"`
	Date        time.Time `json:"date"`
	CreatedAt   time.Time `json:"created_at"`
}

type MessageResponse struct {
	Message string `json:"message"`
}
