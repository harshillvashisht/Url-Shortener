FROM nginx:alpine

# Copy main nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy virtual host configurations
COPY conf.d /etc/nginx/conf.d

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]