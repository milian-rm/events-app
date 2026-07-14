# Events-App

# Servicio A - Gestión de Eventos

Microservicio responsable de la administración de eventos dentro del sistema de administración de eventos. Permite registrar, editar, eliminar, consultar y buscar eventos, además de administrar la capacidad de cada uno.

## Tecnologías

- Node.js + Express
- MongoDB + Mongoose
- JWT (jsonwebtoken) para autenticación de usuarios
- express-validator para validaciones
- helmet, cors, express-rate-limit para seguridad

## Requisitos previos

- Node.js instalado
- Una instancia de MongoDB corriendo (local o remota)

## Instalación

```bash
cd service-events
npm install
```

## Configuración

Crear un archivo `.env` en la raíz de este servicio basado en `.env.example`:

```env
PORT=3002
URI_MONGODB=mongodb://localhost:27017/events-app
EVENTS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

JWT_SECRET=clave-secreta-compartida-con-auth
JWT_ISSUER=auth-service
JWT_AUDIENCE=events-service

INTERNAL_SERVICE_TOKEN=un-token-compartido-largo-y-random
```

> `JWT_SECRET`, `JWT_ISSUER` y `JWT_AUDIENCE` deben coincidir con los que usa el Servicio de Autenticación.
> `INTERNAL_SERVICE_TOKEN` debe coincidir con el valor configurado en el Servicio B, ya que es el token que usa para autenticarse contra este servicio.

## Ejecución

Modo desarrollo (con recarga automática):
```bash
npm run dev
```

Modo producción:
```bash
npm start
```

El servicio queda disponible en `http://localhost:3002/eventsService/v1`.

Health check:
```bash
GET /eventsService/v1/health
```

## Autenticación

Todos los endpoints de eventos requieren autenticación, mediante uno de estos dos métodos:

- **JWT de usuario** (Frontend): header `x-token` o `Authorization: Bearer <token>`, emitido por el Servicio de Autenticación.
- **Token interno** (Servicio B): header `x-internal-token` con el valor de `INTERNAL_SERVICE_TOKEN`.

## Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/eventsService/v1/events` | Lista eventos. Filtros opcionales por query: `name`, `date`, `location` |
| GET | `/eventsService/v1/events/:id` | Obtiene un evento por ID |
| POST | `/eventsService/v1/events` | Crea un evento |
| PUT | `/eventsService/v1/events/:id` | Edita un evento |
| DELETE | `/eventsService/v1/events/:id` | Elimina un evento (soft delete) |

### Modelo de Evento

```json
{
  "eventName": "string (requerido, 2-100 caracteres)",
  "date": "fecha ISO8601 (requerido)",
  "location": "string (requerido)",
  "capacity": "number entero > 0 (requerido)",
  "description": "string (opcional, máx. 500 caracteres)"
}
```

### Notas

- La eliminación es lógica (soft delete): el documento no se borra de MongoDB, se marca `isActive: false` y deja de aparecer en listados y consultas.
- El Servicio B consume `GET /events` y `GET /events/:id` mediante `x-internal-token` para obtener la capacidad de cada evento y calcular disponibilidad de cupos.