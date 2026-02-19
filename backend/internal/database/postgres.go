package database

import (
	"fmt"
	"log"

	"github.com/JuanLopezAranzazu/backend/internal/config"
	"github.com/JuanLopezAranzazu/backend/internal/domain"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func NewPostgresDB(cfg config.DBConfig) (*gorm.DB, error) {
	db, err := gorm.Open(postgres.Open(cfg.DSN()), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		return nil, fmt.Errorf("Ha ocurrido un error al conectar a la base de datos PostgreSQL: %w", err)
	}

	sqlDB, err := db.DB()
	if err != nil {
		return nil, err
	}
	sqlDB.SetMaxOpenConns(25)
	sqlDB.SetMaxIdleConns(10)

	log.Println("La base de datos PostgreSQL se ha conectado exitosamente")
	return db, nil
}

func Migrate(db *gorm.DB) error {
	db.Exec(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`)

	err := db.AutoMigrate(
		&domain.User{},
		&domain.Category{},
		&domain.Account{},
		&domain.Transaction{},
	)
	if err != nil {
		return fmt.Errorf("Ha ocurrido un error durante la migración de la base de datos: %w", err)
	}

	log.Println("Migración de la base de datos completada exitosamente")
	return nil
}
