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

JWT_SECRET=55dtnITgUBY2ocnp8myCLtbJRdNWkCfdvhkcIS3OMpJScZkDwZFvB0yxRqZjoMpf7QbUqXO94cCrpNxUvIeWeg==!
JWT_ISSUER=AdminEventsAuth
JWT_AUDIENCE=AdminEventsAuth

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

El endpoint `GET /events/:id/capacity` acepta ambos métodos indistintamente (JWT de usuario o token interno), ya que tanto el Frontend como el Servicio B necesitan consultarlo.

## Cambios de autenticacion JWT

### Servicio A

- La validacion JWT usa los mismos valores que emite `AuthService`: `SecretKey`, `Issuer` y `Audience`.
- Se acepta el token desde `Authorization: Bearer <token>` o desde `x-token`.
- Se conserva el soporte de `x-internal-token` para comunicacion interna desde Servicio B.
- `ServicioA/.env.example` fue alineado con `AuthService/src/AuthService.Api/appsettings.json`.

### Servicio B

- Las rutas de inscripciones y relaciones usuario-inscripcion quedan protegidas con JWT.
- El middleware valida firma, expiracion, `issuer` y `audience`.
- Se acepta el token desde `Authorization: Bearer <token>` o desde `x-token`.
- `ServicioB/.env.example` fue alineado con los valores JWT de AuthService.

## Endpoints

| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| GET | `/eventsService/v1/events` | Lista eventos. Filtros opcionales por query: `name`, `date`, `location` | JWT |
| GET | `/eventsService/v1/events/:id` | Obtiene un evento por ID | JWT |
| GET | `/eventsService/v1/events/:id/capacity` | Obtiene la capacidad y estado (`isActive`) de un evento, sin el resto de los datos | JWT o token interno |
| POST | `/eventsService/v1/events` | Crea un evento | JWT |
| PUT | `/eventsService/v1/events/:id` | Edita un evento | JWT |
| DELETE | `/eventsService/v1/events/:id` | Elimina un evento (soft delete) | JWT |
| GET | `/eventsService/v1/users` | Lista encargados activos | JWT |
| GET | `/eventsService/v1/users/:id` | Obtiene un encargado por ID | JWT |
| POST | `/eventsService/v1/users` | Crea un encargado de eventos | JWT |
| PUT | `/eventsService/v1/users/:id` | Edita un encargado | JWT |
| DELETE | `/eventsService/v1/users/:id` | Elimina un encargado (soft delete) | JWT |

### Modelo de Evento

```json
{
  "eventName": "string (requerido, 2-100 caracteres)",
  "date": "fecha ISO8601 (requerido)",
  "location": "string (requerido)",
  "capacity": "number entero > 0 (requerido)",
  "managerId": "ObjectId del encargado (requerido)",
  "description": "string (opcional, máx. 500 caracteres)"
}
```

### Modelo de Encargado

```json
{
  "fullName": "string (requerido, 2-100 caracteres)",
  "email": "string email (requerido, unico activo)",
  "phone": "string opcional",
  "documentId": "string opcional",
  "role": "manager"
}
```

### Notas

- La eliminación es lógica (soft delete): el documento no se borra de MongoDB, se marca `isActive: false` y deja de aparecer en listados y consultas.
- El Servicio B consume `GET /events/:id` y `GET /events/:id/capacity` mediante `x-internal-token` para obtener la capacidad de cada evento y calcular disponibilidad de cupos.
- Este servicio **no administra datos de personas ni asistentes** (nombre, correo, inscripciones). Esa información y su lógica correspondiente viven en el Servicio B, que las referencia por `eventId` contra los datos expuestos aquí.
- Los encargados pertenecen a Servicio A. Servicio B consulta la coleccion `users` solo para impedir duplicidad: un encargado activo no puede registrarse como asistente ni enlazarse a una inscripcion.
