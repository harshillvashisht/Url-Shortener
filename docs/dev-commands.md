# Development Commands

## Start infrastructure

docker compose up -d

## Stop infrastructure

docker compose down

## Check containers

docker ps

## Backend

cd backend
npm run dev

## Prisma

npx prisma migrate dev --name <migration_name>

npx prisma studio

npx prisma generate