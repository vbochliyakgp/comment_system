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
        echo "Docker installed. Please log out and back in, then run the script again."
        exit 1
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

# Get SSL certificate
echo "Getting SSL certificate..."
docker compose run --rm certbot certonly --webroot --webroot-path=/var/www/certbot --email $EMAIL --agree-tos --no-eff-email -d $DOMAIN

# Update nginx config with domain
sed -i "s/interiit14.work.gd/$DOMAIN/g" nginx.conf

# Restart nginx with SSL
echo "Restarting nginx with SSL..."
docker compose restart frontend

echo "Deployment complete!"
echo "Your app is available at: https://$DOMAIN"
