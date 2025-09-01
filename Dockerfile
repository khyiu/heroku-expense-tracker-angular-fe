# Use nginx as the base image for serving static files
FROM nginx:alpine

LABEL authors="kyiu"

# Copy the built Angular application from the local dist folder
# Assuming your build output is in dist/your-app-name/
COPY dist/heroku-expense-tracker /usr/share/nginx/html/

# Create nginx configuration for Angular routing
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html index.htm; \
    \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    \
    # Cache static assets \
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ { \
        expires 1y; \
        add_header Cache-Control "public, immutable"; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
