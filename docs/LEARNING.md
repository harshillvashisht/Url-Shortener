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