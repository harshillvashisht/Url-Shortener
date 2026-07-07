# Learning Log

# 2026-07-06

### Docker Compose

- `docker compose up -d` starts containers in the background.
- `docker compose down` stops containers but keeps named volumes.
- `docker compose down -v` also deletes volumes (dangerous if you want to keep the database).

### PostgreSQL

- Docker initializes the database only on the first run.
- Named volumes persist database data across container restarts.

### Prisma

- `schema.prisma` is the source of truth.
- `prisma migrate dev --name <name>`:
  - Creates a migration.
  - Applies it to the database.
  - Generates the Prisma Client.

### DBeaver

- "Properties" shows metadata.
- "Data" shows table rows.
- Refresh the connection after migrations if new tables don't appear.

# 2026-07-07

## Authentication

### JWT

Learned how JWT authentication works end-to-end:

- Generate token after successful authentication.
- Include user identity inside the payload.
- Send the token to the client.
- Verify the token on protected routes.
- Attach authenticated user information to the request.

### Zod

Used Zod for request validation.

Instead of manually checking fields inside controllers, requests are validated before business logic executes.

### DTOs

Used Response DTOs to separate API responses from Prisma models.

This prevents leaking internal fields such as passwordHash.

### Layer Responsibilities

Controller
- HTTP concerns
- Validation
- Response formatting

Service
- Business logic

Repository
- Database access through Prisma

Middleware
- Authentication
- Cross-cutting concerns

### Password Storage

Passwords are never stored directly.

Instead:

password
→ bcrypt
→ passwordHash
→ database

Only password hashes are persisted.

### Runtime vs Compile-time Validation

Encountered an issue where TypeScript accepted an object, but Prisma rejected it.

Example:

```ts
{
    ...userData,
    passwordHash
}