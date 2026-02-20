package domain

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

func generateUUID() string {
	return uuid.NewString()
}

type User struct {
	ID        string         `gorm:"type:uuid;primaryKey" json:"id"`
	Name      string         `gorm:"type:varchar(100);not null" json:"name"`
	Email     string         `gorm:"type:varchar(150);uniqueIndex;not null" json:"email"`
	Password  string         `gorm:"type:varchar(255);not null" json:"-"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`

	Accounts     []Account     `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE" json:"-"`
	Categories   []Category    `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE" json:"-"`
	Transactions []Transaction `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE" json:"-"`
}

func (u *User) BeforeCreate(tx *gorm.DB) error {
	if u.ID == "" {
		u.ID = generateUUID()
	}
	return nil
}

type Category struct {
	ID        string         `gorm:"type:uuid;primaryKey" json:"id"`
	UserID    *string        `gorm:"type:uuid;index" json:"user_id"`
	Name      string         `gorm:"type:varchar(100);not null" json:"name"`
	Type      string         `gorm:"type:varchar(20);not null;check:type IN ('income','expense')" json:"type"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`

	User *User `gorm:"foreignKey:UserID" json:"-"`
}

func (c *Category) BeforeCreate(tx *gorm.DB) error {
	if c.ID == "" {
		c.ID = generateUUID()
	}
	return nil
}

type Account struct {
	ID          string         `gorm:"type:uuid;primaryKey" json:"id"`
	UserID      string         `gorm:"type:uuid;not null;index" json:"user_id"`
	Name        string         `gorm:"type:varchar(100);not null" json:"name"`
	Type        string         `gorm:"type:varchar(50);not null;check:type IN ('cash','bank','credit','savings','investment')" json:"type"`
	Balance     float64        `gorm:"type:decimal(15,2);default:0" json:"balance"`
	Currency    string         `gorm:"type:varchar(10);not null;default:'USD'" json:"currency"`
	Description *string        `gorm:"type:text" json:"description,omitempty"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`

	User         *User         `gorm:"foreignKey:UserID" json:"-"`
	Transactions []Transaction `gorm:"foreignKey:AccountID;constraint:OnDelete:CASCADE" json:"-"`
}

func (a *Account) BeforeCreate(tx *gorm.DB) error {
	if a.ID == "" {
		a.ID = generateUUID()
	}
	return nil
}

type Transaction struct {
	ID          string         `gorm:"type:uuid;primaryKey" json:"id"`
	UserID      string         `gorm:"type:uuid;not null;index" json:"user_id"`
	AccountID   string         `gorm:"type:uuid;not null;index" json:"account_id"`
	CategoryID  *string        `gorm:"type:uuid;index" json:"category_id,omitempty"`
	Type        string         `gorm:"type:varchar(20);not null;check:type IN ('income','expense','transfer')" json:"type"`
	Amount      float64        `gorm:"type:decimal(15,2);not null" json:"amount"`
	Description *string        `gorm:"type:text" json:"description,omitempty"`
	Date        time.Time      `gorm:"type:date;not null" json:"date"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`

	User     *User     `gorm:"foreignKey:UserID" json:"-"`
	Account  *Account  `gorm:"foreignKey:AccountID" json:"-"`
	Category *Category `gorm:"foreignKey:CategoryID" json:"-"`
}

func (t *Transaction) BeforeCreate(tx *gorm.DB) error {
	if t.ID == "" {
		t.ID = generateUUID()
	}
	return nil
}
