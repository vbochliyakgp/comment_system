#!/bin/bash

# Configuration
DOMAIN="interiit14.work.gd"
EMAIL="vbochliya@gmail.com"

echo "Starting deployment..."

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
