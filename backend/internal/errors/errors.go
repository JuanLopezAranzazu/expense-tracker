package errors

import (
	"errors"
	"net/http"
)

type AppError struct {
	Code    int    `json:"-"`
	Message string `json:"message"`
	Err     error  `json:"-"`
}

func (e *AppError) Error() string {
	if e.Err != nil {
		return e.Err.Error()
	}
	return e.Message
}

func (e *AppError) Unwrap() error {
	return e.Err
}

func New(code int, message string, err error) *AppError {
	return &AppError{Code: code, Message: message, Err: err}
}

func BadRequest(message string) *AppError {
	return New(http.StatusBadRequest, message, nil)
}

func Unauthorized(message string) *AppError {
	return New(http.StatusUnauthorized, message, nil)
}

func Forbidden(message string) *AppError {
	return New(http.StatusForbidden, message, nil)
}

func NotFound(message string) *AppError {
	return New(http.StatusNotFound, message, nil)
}

func Conflict(message string) *AppError {
	return New(http.StatusConflict, message, nil)
}

func Internal(err error) *AppError {
	return New(http.StatusInternalServerError, "Ocurrió un error interno en el servidor", err)
}

var (
	ErrNotFound     = errors.New("No se encontró el recurso")
	ErrBadRequest   = errors.New("Solicitud incorrecta")
	ErrForbidden    = errors.New("Prohibido")
	ErrUnauthorized = errors.New("No autorizado")
	ErrConflict     = errors.New("Conflicto")
)
