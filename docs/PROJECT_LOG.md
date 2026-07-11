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

# Day 4 — Redirect, Redis Cache & Analytics

## Goal

Implement the public redirect endpoint and complete the first vertical slice of the URL Shortener.

---

## Features Completed

### Public Redirect Endpoint

Implemented the public endpoint:

GET /:shortCode

Unlike the API endpoints, this route is intended for browsers and is not versioned under `/api/v1`.

Flow:

Browser
    ↓
GET /:shortCode
    ↓
Controller
    ↓
Links Service
    ↓
Redirect (302)

---

### Redis Integration

Added Redis as the application's cache layer.

Implemented the Cache-Aside pattern:

Request
    ↓
Redis
    ↓
Hit?
 ├── Yes → Return cached link
 └── No
        ↓
    PostgreSQL
        ↓
    Cache result
        ↓
    Return link

Instead of caching only the original URL, Redis now stores a minimal Link object containing:

- id
- shortCode
- originalUrl

This allows analytics to work correctly even when the database is not queried.

---

### Analytics

Implemented asynchronous click recording.

After a successful redirect:

Redirect User
      ↓
Fire Analytics (non-blocking)
      ↓
Analytics Service
      ↓
Analytics Repository
      ↓
PostgreSQL

The redirect does not wait for analytics to finish.

Collected information:

- Link ID
- Browser
- Operating System
- IP Address
- Timestamp

Country detection is intentionally postponed.

---

### User-Agent Parsing

Integrated ua-parser-js.

The Analytics Service extracts:

- Browser
- Operating System

from the incoming User-Agent header.

---

### Public vs API Routing

Separated public routes from REST API routes.

Current routing:

API
POST /api/v1/links

Public
GET /:shortCode

This keeps shortened URLs clean while preserving API versioning.

---

## Testing

Verified:

✓ Redirect works correctly.
✓ Redis cache miss populates cache.
✓ Redis cache hit bypasses PostgreSQL.
✓ Analytics recorded on cache miss.
✓ Analytics recorded on cache hit.
✓ Invalid short code returns 404.
✓ Browser successfully follows redirects.

---

## Current Project Status

Authentication
✅ Complete

Create Link
✅ Complete

Redirect
✅ Complete

Redis Cache
✅ Complete

Basic Analytics
✅ Complete

Structured Logging (Pino)
⬜ Next

Analytics API
⬜ Next

Rate Limiting
⬜ Later

QR Code Generation
⬜ Frontend phase

Docker Deployment
⬜ Later

Nginx
⬜ Later

# Day 5 - Improve backend observability by introducing structured logging and implement the remaining link management APIs.

## Completed

### 1. Structured Logging

- Created a centralized Pino logger configuration.
- Integrated `pino-http` with the shared logger instance.
- Added development-friendly pretty logging using `pino-pretty`.
- Configured production to continue using structured JSON logs.
- Added application/business logs using `req.log.info()`.
- Removed the custom logging middleware since `pino-http` already provides automatic request logging.

---

### 2. GET `/links`

Implemented the endpoint for retrieving a user's shortened links.

Features:

- Authentication required.
- Pagination support.
- Zod validation for query parameters.
- Default values:
  - `page = 1`
  - `limit = 10`
- Maximum limit validation.
- Sorted by `createdAt DESC`.
- Returns pagination metadata:
  - current page
  - limit
  - total items
  - total pages

---

### 3. DELETE `/links/:id`

Implemented secure deletion of links.

Features:

- Authentication required.
- Zod validation for route parameters.
- Ownership enforced at the database query level.
- Returns `204 No Content` on success.
- Returns `404` if the link doesn't exist or doesn't belong to the authenticated user.
- Added business logging for successful deletions.

---

## Testing Completed

### Logging

- ✅ Startup logs
- ✅ Automatic request logging
- ✅ Business event logging

### GET /links

- ✅ Default pagination
- ✅ Custom pagination
- ✅ Pagination metadata
- ✅ Ordering
- ✅ Zod validation

### DELETE /links/:id

- ✅ Successful deletion
- ✅ Invalid ID validation
- ✅ Non-existent resource handling
- ✅ Business log generation

---

## Deferred

Regression testing will be performed after completing the Analytics endpoint to avoid repeating the same end-to-end tests.

# Day 6 -Implemented the Analytics module for the URL Shortener backend.

* Added a dedicated Analytics Controller, Service, Repository, Validation, DTO, Types, and Router.
* Exposed a protected endpoint:

  * `GET /api/v1/analytics/:id`
* Secured the endpoint using the existing authentication middleware.

## Analytics Functionality

* Returns:

  * Total clicks
  * Today's clicks
  * Last clicked event
  * Recent click history
* Ownership verification ensures users can only access analytics for their own links.
* Uses Prisma `$transaction()` to efficiently retrieve:

  * Total click count
  * Today's click count
  * Last click
  * Recent 10 click events

## API Improvements

* Introduced a proper Analytics DTO.
* Removed internal database fields (`id`, `linkId`) from API responses.
* Exposed only client-relevant fields:

  * `createdAt`
  * `browser`
  * `os`
  * `ipAddress`

## Bug Fixed

* Analytics endpoint initially failed with:

  * `"Invalid uuid"`
* Root cause:

  * Validation expected UUIDs while the project uses Prisma `cuid()` IDs.
* Updated the validation schema to match the project's identifier format.

## Testing

* Verified authenticated access.
* Verified analytics retrieval.
* Verified DTO transformation.
* Verified click ordering (latest first).
* Verified recent click limiting.
* Verified validation after fixing the CUID issue.

## Architecture

* Maintained the Controller → Service → Repository architecture.
* Validation remains at the controller boundary.
* Business logic remains inside the service.
* Repository is responsible only for database access.
