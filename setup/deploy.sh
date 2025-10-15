#!/bin/bash

# Configuration
DOMAIN="interiit14.work.gd"
EMAIL="vbochliya@gmail.com"

echo "Starting deployment..."

# Function to check and install dependencies
check_dependencies() {
    echo "Checking dependencies..."
    
    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        echo "Docker is not installed. Installing Docker..."
        curl -fsSL https://get.docker.com -o get-docker.sh
        sudo sh get-docker.sh
        sudo usermod -aG docker $USER
        rm get-docker.sh
        echo "Docker installed. Activating group membership..."
        newgrp docker
        echo "Docker ready. Continuing deployment..."
    fi
    
    # Check if Docker Compose is available
    if ! docker compose version &> /dev/null; then
        echo "Docker Compose is not available. Installing Docker Compose..."
        sudo apt-get update
        sudo apt-get install -y docker-compose-plugin
        echo "Docker Compose installed."
    fi
    
    # Check if Docker daemon is running
    if ! docker info &> /dev/null; then
        echo "Docker daemon is not running. Starting Docker..."
        sudo systemctl start docker
        sudo systemctl enable docker
        echo "Docker daemon started."
    fi
    
    # Check if ports 80 and 443 are available
    if lsof -Pi :80 -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "Port 80 is already in use. Please free up port 80."
        exit 1
    fi
    
    if lsof -Pi :443 -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "Port 443 is already in use. Please free up port 443."
        exit 1
    fi
    
    echo "All dependencies are satisfied."
}

# Run dependency check
check_dependencies

# Create certbot directories
mkdir -p certbot/conf certbot/www

# Build and start containers
echo "Building and starting containers..."
docker compose up -d --build

# Wait for nginx to be ready
echo "Waiting for nginx to be ready..."
sleep 10

# Try to get SSL certificate
echo "Attempting to get SSL certificate..."
if docker compose run --rm certbot certonly --webroot --webroot-path=/var/www/certbot --email $EMAIL --agree-tos --no-eff-email -d $DOMAIN; then
    echo "SSL certificate obtained successfully!"
    
    # Add SSL configuration to nginx.conf
    echo "Adding SSL configuration..."
    cat >> nginx.conf << 'EOF'

server {
    listen 443 ssl;
    server_name interiit14.work.gd;
    
    ssl_certificate /etc/letsencrypt/live/interiit14.work.gd/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/interiit14.work.gd/privkey.pem;
    
    location /api/ {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
}
EOF

    # Update HTTP server to redirect to HTTPS
    sed -i '/location \/ {/i\    location / {\n        return 301 https://$server_name$request_uri;\n    }\n\n    location /api/ {' nginx.conf
    sed -i '/location \/api\/ {/,/}/d' nginx.conf

    # Restart nginx with SSL
    echo "Restarting nginx with SSL..."
    docker compose restart frontend
    
    echo "Deployment complete with SSL!"
    echo "Your app is available at: https://$DOMAIN"
else
    echo "SSL certificate generation failed. Continuing with HTTP only."
    echo "Deployment complete without SSL!"
    echo "Your app is available at: http://$DOMAIN"
fi
