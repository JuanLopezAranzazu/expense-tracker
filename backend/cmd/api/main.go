package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/JuanLopezAranzazu/backend/internal/auth"
	"github.com/JuanLopezAranzazu/backend/internal/config"
	"github.com/JuanLopezAranzazu/backend/internal/database"
	"github.com/JuanLopezAranzazu/backend/internal/handlers"
	"github.com/JuanLopezAranzazu/backend/internal/middleware"
	"github.com/JuanLopezAranzazu/backend/internal/repository"
	"github.com/JuanLopezAranzazu/backend/internal/services"

	"github.com/gin-gonic/gin"
)

func main() {
	// Cargar la configuración
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Ha ocurrido un error al cargar la configuración: %v", err)
	}

	// Conectar a la base de datos
	db, err := database.NewPostgresDB(cfg.DB)
	if err != nil {
		log.Fatalf("Ha ocurrido un error al conectar a la base de datos: %v", err)
	}

	// Ejecutar migraciones
	if err := database.Migrate(db); err != nil {
		log.Fatalf("Ha ocurrido un error al ejecutar las migraciones: %v", err)
	}

	// JWT
	jwtSvc := auth.NewJWTService(cfg.JWT)

	// Repositorios
	userRepo := repository.NewUserRepository(db)
	categoryRepo := repository.NewCategoryRepository(db)
	accountRepo := repository.NewAccountRepository(db)

	// Servicios
	authSvc := services.NewAuthService(userRepo, jwtSvc)
	userSvc := services.NewUserService(userRepo)
	categorySvc := services.NewCategoryService(categoryRepo)
	accountSvc := services.NewAccountService(accountRepo)

	// Handlers
	authHandler := handlers.NewAuthHandler(authSvc)
	userHandler := handlers.NewUserHandler(userSvc)
	categoryHandler := handlers.NewCategoryHandler(categorySvc)
	accountHandler := handlers.NewAccountHandler(accountSvc)

	// Configurar Gin
	gin.SetMode(cfg.Server.Mode)
	r := gin.Default()
	r.Use(middleware.CORSMiddleware())

	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	api := r.Group("/api")
	{
		// Rutas de autenticación
		authRoutes := api.Group("/auth")
		{
			authRoutes.POST("/register", authHandler.Register)
			authRoutes.POST("/login", authHandler.Login)
		}

		// Rutas protegidas
		protected := api.Group("/")
		protected.Use(middleware.AuthMiddleware(jwtSvc))
		{
			// Rutas de usuario
			users := protected.Group("/users")
			{
				users.GET("/me", userHandler.GetProfile)
				users.PUT("/me", userHandler.UpdateProfile)
				users.PUT("/me/password", userHandler.ChangePassword)
			}

			// Rutas de categorías
			categories := protected.Group("/categories")
			{
				categories.POST("", categoryHandler.Create)
				categories.GET("", categoryHandler.GetAll)
				categories.GET("/:id", categoryHandler.GetByID)
				categories.PUT("/:id", categoryHandler.Update)
				categories.DELETE("/:id", categoryHandler.Delete)
			}

			// Rutas de cuentas
			accounts := protected.Group("/accounts")
			{
				accounts.POST("", accountHandler.Create)
				accounts.GET("", accountHandler.GetAll)
				accounts.GET("/:id", accountHandler.GetByID)
				accounts.PUT("/:id", accountHandler.Update)
				accounts.DELETE("/:id", accountHandler.Delete)
			}
		}
	}

	addr := fmt.Sprintf(":%s", cfg.Server.Port)
	log.Printf("El servidor está corriendo en %s", addr)

	if err := r.Run(addr); err != nil {
		log.Fatalf("Ha ocurrido un error al iniciar el servidor: %v", err)
	}
}
