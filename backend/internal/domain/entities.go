package domain

import (
	"time"
)

type User struct {
	ID        string    `db:"id" json:"id"`
	Name      string    `db:"name" json:"name"`
	Email     string    `db:"email" json:"email"`
	Password  string    `db:"password" json:"-"`
	CreatedAt time.Time `db:"created_at" json:"created_at"`
	UpdatedAt time.Time `db:"updated_at" json:"updated_at"`
}

type Category struct {
	ID        string    `db:"id" json:"id"`
	UserID    *string   `db:"user_id" json:"user_id"`
	Name      string    `db:"name" json:"name"`
	Type      string    `db:"type" json:"type"`
	CreatedAt time.Time `db:"created_at" json:"created_at"`
	UpdatedAt time.Time `db:"updated_at" json:"updated_at"`
}

type Account struct {
	ID          string    `db:"id" json:"id"`
	UserID      string    `db:"user_id" json:"user_id"`
	Name        string    `db:"name" json:"name"`
	Type        string    `db:"type" json:"type"`
	Balance     float64   `db:"balance" json:"balance"`
	Currency    string    `db:"currency" json:"currency"`
	Description *string   `db:"description" json:"description,omitempty"`
	CreatedAt   time.Time `db:"created_at" json:"created_at"`
	UpdatedAt   time.Time `db:"updated_at" json:"updated_at"`
}

type Transaction struct {
	ID          string    `db:"id" json:"id"`
	UserID      string    `db:"user_id" json:"user_id"`
	AccountID   string    `db:"account_id" json:"account_id"`
	CategoryID  *string   `db:"category_id" json:"category_id,omitempty"`
	Type        string    `db:"type" json:"type"`
	Amount      float64   `db:"amount" json:"amount"`
	Description *string   `db:"description" json:"description,omitempty"`
	Date        time.Time `db:"date" json:"date"`
	CreatedAt   time.Time `db:"created_at" json:"created_at"`
	UpdatedAt   time.Time `db:"updated_at" json:"updated_at"`
}
