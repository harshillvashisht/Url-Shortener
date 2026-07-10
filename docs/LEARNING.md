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

# 2026-07-09

## 1. Cache-Aside Pattern

Redis is used as a cache in front of PostgreSQL.

Flow:

Read Redis
    ↓
Hit?
 ├── Yes → Return
 └── No
        ↓
    Read Database
        ↓
    Store in Redis
        ↓
    Return

This is one of the most common caching strategies used in backend systems.

---

## 2. Cache Design Matters

Initially only the original URL was cached.

However, analytics requires the Link ID.

Caching only the URL would force another database query.

Instead, a minimal Link object is cached:

- id
- shortCode
- originalUrl

This allows both redirect and analytics to work entirely from Redis on cache hits.

---

## 3. HTTP Redirects

Express provides:

res.redirect(url)

which returns a 302 Found response by default.

Browsers automatically navigate to the URL in the Location header.

---

## 4. Fire-and-Forget Async Work

Analytics should never delay a redirect.

Instead of:

await analyticsService.recordClick()

the application intentionally starts analytics asynchronously after sending the redirect.

Important:

Fire-and-forget Promises should still have error handling using `.catch(...)` to avoid unhandled promise rejections.

---

## 5. User-Agent Parsing

The browser sends a User-Agent header.

Using ua-parser-js we can determine:

- Browser
- Operating System

without relying on the frontend.

---

## 6. Feature Boundaries

The Links feature owns the redirect flow.

Analytics is treated as a separate feature.

Flow:

Links Controller
    ↓
Links Service
    ↓
Redirect
    ↓
Analytics Service
    ↓
Analytics Repository

The Links feature never communicates directly with the Analytics repository.

---

## 7. Public Routes vs API Routes

Not every endpoint belongs to the REST API.

REST API:

/api/v1/...

Public redirect:

/:shortCode

Separating these routes keeps the application architecture cleaner.

---

## 8. Reverse Proxy Consideration (Important)

Currently IP addresses are collected using Express.

During local development this is sufficient.

When deploying behind Nginx (or another reverse proxy), Express will otherwise see the proxy's IP instead of the client's real IP.

Deployment reminder:

- Enable Express proxy trust (e.g. `app.set('trust proxy', true)`).
- Configure Nginx to forward the real client IP using the appropriate `X-Forwarded-For` headers.
- Verify that `req.ip` reports the original client IP after deployment.

This should be revisited during the Nginx deployment phase.

## Key Concepts Learned Today

- Redis Cache-Aside pattern
- Cache design decisions
- HTTP 302 Redirects
- Fire-and-forget asynchronous processing
- User-Agent parsing
- Public vs API routing
- Feature boundaries
- Reverse proxy IP forwarding considerations

# 2026-07-10

## Logging

### Pino

- Learned the difference between application logs and automatic HTTP request logs.
- Configured a shared Pino logger used throughout the application.
- Integrated `pino-http` with the shared logger instance.
- Learned why development uses `pino-pretty` while production keeps structured JSON logs.

### Business Logging

Used `req.log.info()` for meaningful events instead of logging every controller action.

Examples:

- User login
- Link retrieval
- Link deletion

---

## Pagination

Learned how pagination is implemented using Prisma.

Components:

- `skip`
- `take`
- `count`

Pagination metadata includes:

- current page
- limit
- total items
- total pages

Also learned why pagination should always use deterministic ordering.

---

## Validation

Used Zod to validate query parameters.

Learned about:

- `z.coerce.number()`
- default values
- numeric constraints
- centralized validation

---

## Prisma

Learned:

- Difference between `delete()` and `deleteMany()`.
- Why ownership checks can be enforced directly in the database query.
- Why counting records requires a separate query.

---

## API Design

Implemented RESTful deletion using:

- `204 No Content`
- ownership authorization
- pagination metadata

Also understood why requesting a page beyond the available data should return an empty array instead of an error.
