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