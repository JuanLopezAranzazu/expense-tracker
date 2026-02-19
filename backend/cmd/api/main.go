package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/JuanLopezAranzazu/backend/internal/config"
	"github.com/JuanLopezAranzazu/backend/internal/database"
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

	// Configurar el servidor HTTP
	http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK"))
	})

	addr := fmt.Sprintf(":%s", cfg.Server.Port)
	log.Printf("El servidor está corriendo en %s", addr)
	if err := http.ListenAndServe(addr, nil); err != nil {
		log.Fatalf("Ha ocurrido un error al iniciar el servidor: %v", err)
	}
}
