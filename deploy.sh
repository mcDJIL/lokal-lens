#!/bin/bash

echo "🚀 Starting Lokal Lens Backend Deployment..."

# Stop and remove existing containers
echo "📦 Stopping existing containers..."
docker-compose down

# Pull latest changes (if using git)
# git pull origin main

# Build and start containers
echo "🔨 Building Docker images..."
docker-compose build --no-cache

echo "🚀 Starting containers..."
docker-compose up -d

# Wait for MySQL to be ready
echo "⏳ Waiting for MySQL to be ready..."
sleep 10

# Run migrations
echo "🔄 Running database migrations..."
docker-compose exec -T backend npx prisma migrate deploy

# Optional: Run seeder
echo "🌱 Running database seeder..."
docker-compose exec -T backend npm run prisma:seed

echo "✅ Deployment completed!"
echo "📊 Check logs with: docker-compose logs -f backend"
echo "🔍 Check status with: docker-compose ps"
