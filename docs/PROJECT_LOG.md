# Project Log

## Day 1

### Completed

- Initialized backend project.
- Added Docker Compose with PostgreSQL and Redis.
- Connected DBeaver.
- Configured Prisma.
- Designed initial schema:
  - User
  - Link
  - Click
- Created first migration.
- Verified tables in PostgreSQL.

### Decisions

- Authentication required before shortening URLs.
- No anonymous users.
- No link expiry in v1.
- PostgreSQL + Redis in Docker.
- Node.js runs locally during development.

### Next

- Implement Auth feature.
- POST /auth/register.

## Day 2 — Authentication Module Completed

### Features Implemented

Completed the first authentication module consisting of:

- POST /api/v1/auth/register
- POST /api/v1/auth/login
- GET /api/v1/auth/me (protected)

### Authentication Flow

Implemented JWT-based authentication.

Register:
- Validate request
- Check duplicate email
- Hash password
- Create user
- Generate JWT
- Return user + token

Login:
- Validate request
- Verify email exists
- Compare password using bcrypt
- Generate JWT
- Return user + token

Profile:
- Protect route using JWT middleware
- Verify token
- Extract authenticated user
- Fetch latest user from database
- Return authenticated user's profile

### Architecture

Authentication follows the layered architecture established during the infrastructure phase.

Request
↓
Validation (Zod)
↓
Controller
↓
Service
↓
Repository
↓
Prisma
↓
PostgreSQL


Added:

- Request validation
- Response DTOs
- JWT authentication middleware
- Global error handling integration
- Password hashing with bcrypt

### Testing

Verified:

- Successful registration
- Duplicate email rejection
- Successful login
- Invalid credentials
- Request validation failures
- Password hashing
- JWT generation
- Protected route authentication
- Database persistence through DBeaver

### Result

Authentication module is complete for v1.

The backend can now authenticate users and authorize access to protected routes.

#  Day 3 - Create links endpoint completed 

## Goal

Implement the first Links feature by allowing authenticated users to create shortened URLs.

## Work Completed

### Link Creation Endpoint

* Implemented protected `POST /links` endpoint.
* Added request validation using Zod.
* Created controller, service, repository and DTO layers following the existing project architecture.
* Generated 7-character short codes using Nano ID.
* Stored shortened links in PostgreSQL through Prisma.
* Returned a clean response DTO containing the generated short URL.

### Validation Improvements

* URL syntax validation through Zod.
* Added business validation to only allow `http` and `https` protocols.
* Removed redundant validation that was already handled by Zod.

### Reliability Improvements

* Discussed short code collision scenarios.
* Implemented retry logic for unique constraint collisions.
* Added a helper to detect Prisma `P2002` errors specifically for the `shortCode` field.
* Retry attempts are limited before returning an internal server error.

### Testing

Successfully tested:

* Valid HTTP URLs.
* Valid HTTPS URLs.
* Missing authentication.
* Invalid authentication token.
* Invalid URL format.
* Unsupported protocols (`ftp`, `javascript`).
* Empty request body.

All tests passed successfully.

## Architectural Decisions

* URL syntax validation belongs in the validation layer.
* Protocol restrictions belong in the service layer as business rules.
* Collision handling should rely on the database's unique constraint instead of performing a separate existence check.
* Retry only on recoverable unique constraint errors.

## Next Session

Implement the public redirect endpoint (`GET /:shortCode`) as a complete vertical slice:

* Redis cache lookup.
* PostgreSQL fallback.
* Cache population.
* Immediate redirect.
* Fire-and-forget analytics collection without RabbitMQ.

