# Use the official Nginx image to serve static files
FROM nginx:alpine

# Copy the static files to the Nginx html directory
COPY . /usr/share/nginx/html/

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 8080 (Cloud Run requirement)
EXPOSE 8080

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]