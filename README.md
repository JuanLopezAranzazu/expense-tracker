# Expense Tracker

Aplicación para el seguimiento de gastos personales. El backend está construido con Go, PostgreSQL y JWT para autenticación, y el frontend con React, Vite, Tailwind CSS y Mantine.

# Backend

## Configuración

1. **Copia el archivo de variables de entorno:**
```bash
cp .env.example .env
```

2. **Edita `.env` con tus datos:**
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_NAME=expense_tracker
JWT_SECRET=your_super_secret_key
```

3. **Instala dependencias:**
```bash
go mod tidy
```

4. **Ejecuta el servidor:**
```bash
make run
# o directamente:
go run ./cmd/api/main.go
```

Las migraciones se ejecutan automáticamente al iniciar el servidor.

---

## Endpoints

### Auth (público)
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/auth/register` | Registrar usuario |
| POST | `/api/auth/login` | Iniciar sesión |

### Users (requiere JWT)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/users/me` | Obtener perfil |
| PUT | `/api/users/me` | Actualizar perfil |
| PUT | `/api/users/me/password` | Cambiar contraseña |

### Categories (requiere JWT)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/categories` | Listar categorías |
| POST | `/api/categories` | Crear categoría |
| GET | `/api/categories/:id` | Obtener por ID |
| PUT | `/api/categories/:id` | Actualizar |
| DELETE | `/api/categories/:id` | Eliminar |

### Accounts (requiere JWT)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/accounts` | Listar cuentas |
| POST | `/api/accounts` | Crear cuenta |
| GET | `/api/accounts/:id` | Obtener por ID |
| PUT | `/api/accounts/:id` | Actualizar |
| DELETE | `/api/accounts/:id` | Eliminar |

### Transactions (requiere JWT)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/transactions` | Listar transacciones |
| POST | `/api/transactions` | Crear transacción |
| GET | `/api/transactions/:id` | Obtener por ID |
| PUT | `/api/transactions/:id` | Actualizar |
| DELETE | `/api/transactions/:id` | Eliminar |

---

# Frontend

Interfaz web para gestionar cuentas, categorías y transacciones, con un resumen mensual de ingresos y gastos. Consume la API descrita arriba.

## Stack

| Tecnología | Uso |
|------------|-----|
| [React 19](https://react.dev) + TypeScript | Interfaz |
| [Vite](https://vite.dev) | Servidor de desarrollo y build |
| [Tailwind CSS v4](https://tailwindcss.com) | Utilidades de estilo |
| [Mantine 9](https://mantine.dev) (`core`, `form`, `dates`, `charts`, `modals`, `notifications`) | Componentes, formularios y gráficas |
| [TanStack Query](https://tanstack.com/query) | Consultas a la API y caché |
| [React Router](https://reactrouter.com) | Rutas |
| [Axios](https://axios-http.com) | Cliente HTTP |

**Requisitos:** Node.js 20.19 o superior y el backend en ejecución.

## Configuración del frontend

1. **Entra a la carpeta e instala dependencias:**
```bash
cd frontend
pnpm install
```

2. **Copia el archivo de variables de entorno:**
```bash
cp .env.example .env
```

3. **Edita `.env` con la URL de tu API:**
```env
VITE_API_URL=http://localhost:8080
```

4. **Levanta el servidor de desarrollo** (con el backend ya corriendo):
```bash
pnpm dev
```

La aplicación queda disponible en `http://localhost:5173`.

## Scripts

| Comando | Descripción |
|---------|-------------|
| `pnpm dev` | Servidor de desarrollo con recarga en caliente |
| `pnpm build` | Verifica los tipos con `tsc` y genera el build de producción en `dist/` |
| `pnpm preview` | Sirve el build de producción localmente |
