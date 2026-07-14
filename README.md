# AdminEvents - Sistema de Eventos

Sistema de administración de eventos con arquitectura de microservicios. Permite gestionar eventos, encargados, inscripciones y visualizar reportes de ocupación.

## Arquitectura

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Frontend   │────▶│  AuthService     │     │   ServicioA     │
│  React 19    │     │  .NET 8 / C#     │     │  Node.js/Express│
│  Vite 8      │     │  PostgreSQL      │     │  MongoDB        │
│  Tailwind 4  │     │  Puerto: 5149    │     │  Puerto: 3001   │
└──────┬──────┘     └──────────────────┘     └────────┬────────┘
       │                                               │
       │          ┌──────────────────┐                 │
       └─────────▶│   ServicioB      │─────────────────┘
                  │  Node.js/Express │  (mismo MongoDB)
                  │  MongoDB         │
                  │  Puerto: 3101    │
                  └──────────────────┘
```

## Servicios

| Servicio | Tecnología | Puerto | Base de Datos | Descripción |
|----------|-----------|--------|---------------|-------------|
| **Frontend** | React 19 + Vite 8 + Tailwind 4 | 5173 | - | Interfaz de usuario |
| **AuthService** | .NET 8 / ASP.NET Core | 5149 | PostgreSQL (`admin_events_auth_db`) | Autenticación y gestión de admins |
| **ServicioA** | Node.js 22 + Express 5 | 3001 | MongoDB (`events-app`) | CRUD de eventos y encargados |
| **ServicioB** | Node.js + Express 5 | 3101 | MongoDB (`events-app`) | Inscripciones y reportes |

## Stack Tecnológico

### Frontend
- **React 19** - UI library
- **Vite 8** - Build tool
- **Tailwind CSS 4** - Styling
- **Zustand 5** - State management
- **React Router 7** - Routing
- **Axios** - HTTP client
- **Heroicons** - Iconos

### AuthService (.NET)
- **ASP.NET Core 8** - Web API
- **Entity Framework Core** - ORM
- **Npgsql** - PostgreSQL driver
- **JWT Bearer** - Autenticación
- **Argon2id** - Hashing de contraseñas
- **MailKit** - Envío de correos
- **Cloudinary** - Almacenamiento de imágenes
- **Serilog** - Logging
- **Swagger** - Documentación API

### ServicioA (Events)
- **Express 5** - Web framework
- **Mongoose 9** - MongoDB ODM
- **express-validator** - Validación
- **Helmet** - Seguridad HTTP
- **Morgan** - Logging

### ServicioB (Inscriptions)
- **Express 5** - Web framework
- **Mongoose 9** - MongoDB ODM
- **express-validator** - Validación
- **Helmet** - Seguridad HTTP
- **Morgan** - Logging

## Requisitos Previos

- **.NET 8 SDK** - [Download](https://dotnet.microsoft.com/download/dotnet/8.0)
- **Node.js 22+** - [Download](https://nodejs.org/)
- **PostgreSQL 14+** - [Download](https://www.postgresql.org/download/)
- **MongoDB 6+** - [Download](https://www.mongodb.com/try/download/community)

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/milian-rm/events-app.git
cd events-app
```

### 2. Configurar bases de datos

**PostgreSQL** (para AuthService):
```sql
CREATE DATABASE admin_events_auth_db;
```

**MongoDB** (para ServicioA y ServicioB):
```bash
# MongoDB crea la base de datos automáticamente al conectarse
# Base de datos: events-app
```

### 3. Configurar variables de entorno

Cada servicio tiene su archivo `.env`. Copia los `.env.example` y configura:

**AuthService** (`AuthService/src/AuthService.Api/appsettings.json`):
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=127.0.0.1;Port=5434;Database=admin_events_auth_db;Username=postgres;Password=tu_password"
  }
}
```

**ServicioA** (`ServicioA/.env`):
```env
PORT=3001
URI_MONGODB=mongodb://localhost:27017/events-app
JWT_SECRET=tu_jwt_secret
JWT_ISSUER=AdminEventsAuth
JWT_AUDIENCE=AdminEventsAuth
INTERNAL_SERVICE_TOKEN=tu_token_interno
```

**ServicioB** (`ServicioB/.env`):
```env
PORT=3101
URI_MONGODB=mongodb://localhost:27017/events-app
JWT_SECRET=tu_jwt_secret
JWT_ISSUER=AdminEventsAuth
JWT_AUDIENCE=AdminEventsAuth
INTERNAL_SERVICE_TOKEN=tu_token_interno
```

**Frontend** (`frontend/.env`):
```env
VITE_AUTH_URL=http://localhost:5149/api/v1
VITE_EVENTS_URL=http://localhost:3001/eventsService/v1
VITE_REGISTRATIONS_URL=http://localhost:3101/eventSystem/v1
```

### 4. Instalar dependencias y ejecutar

**AuthService** (.NET):
```bash
cd AuthService
dotnet restore
dotnet run --project src/AuthService.Api
```

**ServicioA** (Node.js):
```bash
cd ServicioA
npm install
npm start
```

**ServicioB** (Node.js):
```bash
cd ServicioB
npm install
npm start
```

**Frontend** (React):
```bash
cd frontend
npm install
npm run dev
```

## Endpoints

### AuthService (Puerto 5149)

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| `POST` | `/api/v1/Auth/login` | Iniciar sesión | No |
| `POST` | `/api/v1/Auth/register` | Registrar admin | No |
| `GET` | `/api/v1/Auth/profile` | Obtener perfil | JWT |
| `POST` | `/api/v1/Auth/profile/by-id` | Obtener perfil por ID | No |
| `POST` | `/api/v1/Auth/verify-email` | Verificar email | No |
| `POST` | `/api/v1/Auth/resend-verification` | Reenviar verificación | No |
| `POST` | `/api/v1/Auth/forgot-password` | Recuperar contraseña | No |
| `POST` | `/api/v1/Auth/reset-password` | Restablecer contraseña | No |

**Swagger UI**: `http://localhost:5149/swagger`

### ServicioA - Events (Puerto 3001)

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| `GET` | `/eventsService/v1/events` | Listar eventos | JWT |
| `GET` | `/eventsService/v1/events/:id` | Obtener evento | JWT |
| `POST` | `/eventsService/v1/events` | Crear evento | JWT |
| `PUT` | `/eventsService/v1/events/:id` | Actualizar evento | JWT |
| `DELETE` | `/eventsService/v1/events/:id` | Eliminar evento | JWT |
| `GET` | `/eventsService/v1/events/:id/capacity` | Obtener capacidad | JWT/Internal |
| `GET` | `/eventsService/v1/users` | Listar encargados | JWT |
| `GET` | `/eventsService/v1/users/:id` | Obtener encargado | JWT |
| `POST` | `/eventsService/v1/users` | Crear encargado | JWT |
| `PUT` | `/eventsService/v1/users/:id` | Actualizar encargado | JWT |
| `DELETE` | `/eventsService/v1/users/:id` | Eliminar encargado | JWT |

### ServicioB - Inscriptions (Puerto 3101)

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| `GET` | `/eventSystem/v1/events/available` | Eventos con cupo | JWT |
| `GET` | `/eventSystem/v1/events/full` | Eventos completos | JWT |
| `GET` | `/eventSystem/v1/events/:id/attendees` | Asistentes del evento | JWT |
| `POST` | `/eventSystem/v1/registrations` | Crear inscripción | JWT |
| `DELETE` | `/eventSystem/v1/registrations/:id` | Cancelar inscripción | JWT |
| `GET` | `/eventSystem/v1/summary` | Resumen de ocupación | JWT |

## Estructura del Proyecto

```
events-app/
├── AuthService/                    # Servicio de autenticación (.NET)
│   ├── src/
│   │   ├── AuthService.Api/        # API REST
│   │   │   ├── Controllers/        # Endpoints
│   │   │   ├── Extensions/         # Configuración DI, JWT, CORS
│   │   │   ├── Middlewares/        # Manejo de errores
│   │   │   └── Program.cs          # Entry point
│   │   ├── AuthService.Application/# Lógica de negocio
│   │   │   ├── DTOs/               # Data Transfer Objects
│   │   │   ├── Interfaces/         # Contratos
│   │   │   └── Services/           # Implementaciones
│   │   ├── AuthService.Domain/     # Entidades y constantes
│   │   │   ├── Entities/           # Modelos de dominio
│   │   │   └── Interfaces/         # Contratos de repositorio
│   │   └── AuthService.Persistence/# Acceso a datos
│   │       ├── Data/               # DbContext y Seed
│   │       └── Repositories/       # Implementaciones de repositorio
│   └── AuthService.sln
│
├── ServicioA/                      # Servicio de eventos (Node.js)
│   ├── configs/                    # Configuración del servidor
│   ├── middlewares/                 # Validadores y auth
│   ├── src/
│   │   ├── events/                 # CRUD de eventos
│   │   └── users/                  # CRUD de encargados
│   └── index.js                    # Entry point
│
├── ServicioB/                      # Servicio de inscripciones (Node.js)
│   ├── configs/                    # Configuración del servidor
│   ├── middlewares/                 # Validadores y auth
│   ├── src/
│   │   ├── inscriptions/           # CRUD de inscripciones
│   │   └── userRegistrations/      # Relación usuario-inscripción
│   └── index.js                    # Entry point
│
└── frontend/                       # Aplicación React
    ├── src/
    │   ├── app/                    # Router y layout
    │   ├── features/
    │   │   ├── auth/               # Login y registro de admins
    │   │   ├── events/             # Gestión de eventos
    │   │   ├── registrations/      # Gestión de inscripciones
    │   │   └── users/              # Gestión de encargados
    │   └── shared/
    │       ├── api/                # Clientes HTTP
    │       └── components/         # Layout compartido
    └── vite.config.js
```

## Funcionalidades

### Autenticación
- Login con JWT
- Registro de admins (solo desde el dashboard)
- Verificación de email
- Recuperación de contraseña
- Rate limiting en endpoints de auth

### Gestión de Eventos
- CRUD completo de eventos
- Asignación de encargados
- Búsqueda por nombre, fecha y lugar
- Control de capacidad

### Gestión de Encargados
- CRUD de encargados (managers)
- Campos: nombre, apellido, teléfono, email

### Inscripciones
- Inscripción de asistentes a eventos
- Control de cupos disponibles
- Cancelación de inscripciones
- Vista de asistentes por evento

### Resumen
- Estadísticas generales
- Ocupación global con barra de progreso
- Tabla detallada por evento

## JWT Configuration

Todos los servicios comparten la misma configuración JWT:

```json
{
  "SecretKey": "55dtnITgUBY2ocnp8myCLtbJRdNWkCfdvhkcIS3OMpJScZkDwZFvB0yxRqZjoMpf7QbUqXO94cCrpNxUvIeWeg==!",
  "Issuer": "AdminEventsAuth",
  "Audience": "AdminEventsAuth",
  "ExpiryInMinutes": 30
}
```

## Credenciales por Defecto

Al ejecutar el AuthService por primera vez, se crea un admin seed:

| Campo | Valor |
|-------|-------|
| Email | `admin@adminevents.com` |
| Contraseña | `Admin123!` |

## Desarrollo

### Frontend

```bash
cd frontend
npm run dev      # Servidor de desarrollo en http://localhost:5173
npm run build    # Build de producción
npm run lint     # Linting
```

### Backend

```bash
# AuthService
cd AuthService
dotnet run --project src/AuthService.Api

# ServicioA
cd ServicioA
npm run dev      # Con nodemon (auto-reload)

# ServicioB
cd ServicioB
npm start
```

## Licencia

ISC
