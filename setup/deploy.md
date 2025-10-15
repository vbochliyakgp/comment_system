# Deploy Guide

## Quick Deploy

1. **Update domain in files:**

2. **Run deployment:**
   ```bash
   ./deploy.sh
   ```

## What it does

- Builds 3 containers: MongoDB, Backend, Frontend
- Gets SSL certificate from Let's Encrypt
- Configures Nginx with HTTPS
- Deploys app at `https://interiit14.work.gd`

## Manual Commands

```bash
# Build and start
docker-compose up -d --build

# Get SSL cert
docker-compose run --rm certbot certonly --webroot --webroot-path=/var/www/certbot --email your-email@example.com --agree-tos --no-eff-email -d your-domain.com

# Restart with SSL
docker-compose restart frontend
```

## Files

- `docker-compose.yml` - 3 services (mongodb, backend, frontend)
- `nginx.conf` - Reverse proxy with SSL
- `deploy.sh` - Automated deployment script
- `backend/Dockerfile` - Node.js API
- `frontend/Dockerfile` - React app with Nginx
