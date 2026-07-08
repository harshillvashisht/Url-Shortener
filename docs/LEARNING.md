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

# 2026-07-08

Today's session was less about writing code and more about backend design decisions.

## Key Learnings

### Validation Layers

I learned that validation can exist at different layers.

* Zod validates request shape and syntax.
* Services enforce business rules.

For URLs:

* Zod checks if the value is a valid URL.
* The service decides whether only HTTP and HTTPS should be accepted.

---

### Database Constraints as a Safety Net

Initially I thought checking whether a generated short code already existed would be enough.

I learned that two requests can generate the same short code at nearly the same time, creating a race condition.

The correct approach is to:

* Let the database enforce uniqueness.
* Retry only when a unique constraint violation occurs.

---

### TypeScript Type Predicates

I learned about functions with return types like:

`error is PrismaClientKnownRequestError`

This doesn't change the runtime value—it teaches the TypeScript compiler how to narrow the type after runtime checks.

This was one of the first TypeScript features that felt unfamiliar, but after breaking it down line by line I now understand the purpose of:

* `unknown`
* `instanceof`
* Type predicates
* Optional chaining
* Checking Prisma error metadata

I probably couldn't write this helper from memory yet, but I now understand the reasoning behind every part of it.

---

### Error Handling

Not every error should be retried.

Only expected and recoverable errors should trigger retries.

Unexpected errors should immediately propagate upward.

---

### Project Architecture

Today's implementation reinforced the separation of responsibilities:

* Controller → HTTP concerns.
* Service → Business logic.
* Repository → Database operations.
* DTO → Response formatting.
* Shared helpers → Reusable infrastructure logic.

Keeping each layer focused makes the code easier to extend later.

## Looking Ahead

The next feature will implement the redirect endpoint as a complete request pipeline rather than just making redirects work.

That pipeline will introduce:

* Redis cache-aside pattern.
* Fire-and-forget analytics.
* Browser redirects.
* Request-derived analytics (IP, browser, operating system).
