# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build


# Production stage
FROM nginx:alpine

# Copy built React files
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy frontend-only nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]