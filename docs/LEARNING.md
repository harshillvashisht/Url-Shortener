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

# 2026-07-11

## 1. DTOs Should Represent the Public API

Initially, the Analytics DTO simply returned the Prisma model without modification, making it effectively unnecessary.

After reviewing the response, the DTO was updated to transform database models into API-specific objects by removing internal fields (`id`, `linkId`) while exposing only the fields required by the client.

This reinforced that DTOs are responsible for defining the API contract rather than mirroring database models.

---

## 2. Validation Must Match the Data Model

A bug occurred because the analytics route validated the ID using `z.string().uuid()` while the project uses Prisma's `cuid()` identifiers.

Although the request contained a valid link ID, validation failed before reaching the service layer.

Lesson:
Validation rules should always reflect the actual identifier strategy used throughout the project.

---

## 3. Database Aggregation Over Application Logic

Analytics was implemented using Prisma's aggregation methods instead of loading click records into memory.

The database performs:

* Total click count
* Today's click count
* Latest click retrieval
* Recent click retrieval

This keeps the application lightweight and lets the database perform the operations it is optimized for.

---

## 4. Prisma Transactions for Independent Queries

Multiple independent analytics queries were grouped inside a Prisma `$transaction()`.

Benefits:

* Cleaner code.
* Single database round trip.
* Related analytics values are retrieved together.

---

## 5. Separation of Responsibilities

The Analytics module followed the same architecture as the rest of the project:

* Controller

  * Validation
  * Authentication checks
  * Response handling

* Service

  * Ownership verification
  * Business rules

* Repository

  * Prisma queries only

This consistency makes future features easier to implement and maintain.

---

## 6. API Design

Internal database identifiers are implementation details and should not be exposed unless clients genuinely need them.

Returning only meaningful fields results in a cleaner, more stable API that remains independent of future database implementation changes.

---

## 7. Code Review Observations

* Avoid validation that duplicates guarantees already provided at the controller boundary.
* Repository methods should be named according to what they actually query (e.g., querying by a primary key should reflect that in the method name).
* Optimize only after identifying an actual performance bottleneck; readability and maintainability are more valuable for this stage of the project.


# 2026-07-12

## Topic
Redis Token Bucket Rate Limiter using Lua

## What I learned

- Understood different rate limiting algorithms and chose Token Bucket.
- Learned why Redis is preferred for distributed rate limiting.
- Learned why Lua scripts are required for atomic operations inside Redis.
- Understood the race condition that occurs when GET and SET are executed separately.
- Learned how EVAL and EVALSHA execute Lua scripts.
- Understood why SCRIPT LOAD returns a SHA hash.
- Learned the difference between EVAL (sends the entire script) and EVALSHA (uses cached script).
- Implemented a reusable TokenBucket class in TypeScript.
- Stored bucket state using Redis hashes (HSET/HMGET).
- Added automatic key expiration to clean up inactive buckets.
- Implemented an Express rate-limiting middleware.
- Added X-RateLimit-Remaining response headers.
- Tested the implementation using Postman Runner.
- Learned that refill configuration significantly affects observed behaviour during manual testing.

## Interesting observations

Initially it appeared that the rate limiter was not working because every request showed 9 remaining tokens.

The actual reason was that requests were being made approximately one second apart while the bucket refilled one token every second. The bucket was therefore replenished before the next request arrived.

Using Postman Runner to send many requests rapidly confirmed that the implementation correctly returned HTTP 429 after the bucket capacity was exhausted.

## Key takeaway

Implementing the algorithm from scratch provided a much deeper understanding of Redis scripting, atomicity, and distributed rate limiting than simply using an npm middleware.

# 2026-07-15

## Things I Learned

### 1. React Context

Context is not just another place to store data.

Its purpose is to provide shared application state without prop drilling.

For authentication, Context becomes the single source of truth for the current user.

---

### 2. Authentication has three states

Instead of thinking:

- Logged In
- Logged Out

The application actually has:

- Initializing
- Authenticated
- Unauthenticated

The initializing state exists because the frontend has not yet asked the backend whether the user has a valid session.

---

### 3. Why `/auth/me` exists

Refreshing the browser destroys all React state.

The authentication cookie still exists inside the browser.

Calling `/auth/me` allows React to reconstruct its authentication state using that cookie.

---

### 4. Protected vs Public Routes

ProtectedRoute protects authenticated pages.

PublicRoute prevents authenticated users from returning to authentication pages.

Routing decisions are based on authentication state rather than manually navigating everywhere.

---

### 5. Layered Frontend Architecture

Authentication now follows multiple layers instead of placing everything inside a page.

Page
→ Hook
→ Context
→ API Layer
→ Axios
→ Backend

Each layer has a single responsibility.

---

### 6. Error Classification

Not every failed request is an application error.

A 401 response from `/auth/me` is expected when no user is logged in.

Unexpected failures (network issues, server errors) should be handled differently.

---

### Architecture Reflection

This was the first frontend feature built using a layered architecture similar to the backend.

Instead of pages directly making HTTP requests, responsibilities were separated into:

Page
→ Hook
→ Context
→ API Layer
→ Axios
→ Backend

This separation keeps components focused on rendering while networking and authentication logic remain centralized and reusable.

A key takeaway from this session was understanding why global state is necessary for authentication and how React Context eliminates prop drilling by providing a single source of truth for the authenticated user.

### Overall Reflection

This was the first frontend feature where the architecture started feeling similar to backend architecture.

Instead of directly calling APIs from components, responsibilities are separated into different layers, making the codebase easier to understand and extend.

# 2026-07-16

## React Component Responsibilities

Today's work reinforced that every component should have a single responsibility.

Examples:

- CreateLinkForm → creating links
- LinkCard → displaying one link
- LinkList → displaying collections
- Pagination → changing pages
- Dashboard → orchestrating components

---

## State Ownership

Not every state belongs in the page.

Current ownership:

Dashboard

- Current page number

useLinks

- Links
- Pagination data
- Loading
- CRUD operations

LinkCard

- Copy button feedback

Keeping state close to where it is needed simplifies components.

---

## Custom Hooks

A custom hook is not just a wrapper around API calls.

It represents a feature.

`useLinks` encapsulates the entire "Links" domain.

Components consume the hook without knowing implementation details.

---

## Separation of Concerns

Architecture followed:

Page

↓

Custom Hook

↓

API Layer

↓

Axios

↓

Backend

Components never communicate directly with axios.

---

## UI vs Business Logic

Business logic remains inside hooks.

Components focus on rendering and user interaction.

This separation made the dashboard easy to compose.

---

## Pagination Flow

Changing page does not fetch data directly.

Flow:

Pagination

↓

Dashboard updates page state

↓

useLinks receives new page

↓

useEffect runs

↓

fetchLinks()

↓

Links update

↓

UI re-renders

---

## Environment Configuration

Instead of hardcoding URLs, environment variables should be used.

Configuration is centralized inside a single config module.

This makes deployment easier without changing source code.

---

# Decisions Made

- Dashboard owns only UI state (current page).
- useLinks owns all link-related business logic.
- Pagination updates page state only.
- Pagination never performs API requests.
- LinkList owns loading and empty state rendering.
- LinkCard owns only local UI state ("Copied!").
- Backend returns shortCode, not shortUrl.
- Frontend constructs shortUrl using environment configuration.
- Environment values centralized inside config.ts.
- Analytics will display one selected link rather than choosing from a dropdown.
- Dashboard is for link management; Analytics page is for insights only.

---

## Overall Reflection

This session required significantly less architectural guidance compared to the authentication phase.

The architecture established earlier proved reusable.

The focus shifted from learning React fundamentals to applying architectural decisions consistently.