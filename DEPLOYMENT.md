# Deployment Guide - Lokal Lens Backend

## Deployment dengan Docker di VPS

### Prerequisites
- VPS dengan Ubuntu 20.04+ atau Debian 11+
- Docker & Docker Compose terinstall
- Domain (opsional, untuk SSL)
- Minimal 2GB RAM, 2 CPU cores

---

## 1. Install Docker di VPS

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker

# Verify installation
docker --version
docker-compose --version
```

---

## 2. Setup Project di VPS

```bash
# Clone repository
git clone <your-repo-url> lokal-lens-backend
cd lokal-lens-backend

# Copy environment file
cp .env.production .env

# Edit .env dengan kredensial yang aman
nano .env
```

**Update `.env` dengan nilai yang aman:**
```env
DB_ROOT_PASSWORD=your_very_strong_root_password_123!
DB_PASSWORD=your_very_strong_db_password_456!
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long-789!
```

---

## 3. Deploy dengan Docker Compose

```bash
# Build dan jalankan containers
docker-compose up -d

# Check logs
docker-compose logs -f backend

# Check status
docker-compose ps
```

---

## 4. Jalankan Database Migration

```bash
# Run migrations
docker-compose exec backend npx prisma migrate deploy

# (Optional) Run seeder
docker-compose exec backend npm run prisma:seed
```

---

## 5. Setup Nginx Reverse Proxy (Recommended)

```bash
# Install Nginx
sudo apt install nginx -y

# Create Nginx config
sudo nano /etc/nginx/sites-available/lokal-lens
```

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    client_max_body_size 10M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/lokal-lens /etc/nginx/sites-enabled/

# Test Nginx config
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

---

## 6. Setup SSL dengan Let's Encrypt (Recommended)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d api.yourdomain.com

# Auto-renewal test
sudo certbot renew --dry-run
```

---

## 7. Useful Commands

### Docker Commands
```bash
# View logs
docker-compose logs -f backend
docker-compose logs -f mysql

# Restart services
docker-compose restart backend

# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: deletes database)
docker-compose down -v

# Rebuild containers
docker-compose up -d --build

# Execute command in container
docker-compose exec backend npm run prisma:studio
```

### Database Backup
```bash
# Backup database
docker-compose exec mysql mysqldump -u root -p lokal-lens > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore database
docker-compose exec -T mysql mysql -u root -p lokal-lens < backup_20241121_120000.sql
```

### Monitoring
```bash
# Check container stats
docker stats

# Check disk usage
docker system df

# Clean up unused images
docker system prune -a
```

---

## 8. Auto Deployment Script

Gunakan `deploy.sh` untuk deployment otomatis:

```bash
# Make script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

---

## 9. Setup Firewall (UFW)

```bash
# Enable UFW
sudo ufw enable

# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP & HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Check status
sudo ufw status
```

---

## 10. Monitoring & Logs

### View Application Logs
```bash
# Real-time logs
docker-compose logs -f backend

# Last 100 lines
docker-compose logs --tail=100 backend
```

### Setup Log Rotation
```bash
# Create logrotate config
sudo nano /etc/logrotate.d/lokal-lens
```

```
/path/to/lokal-lens-backend/logs/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 nodejs nodejs
    sharedscripts
}
```

---

## Troubleshooting

### Container tidak bisa start
```bash
# Check logs
docker-compose logs backend

# Check MySQL connection
docker-compose exec backend npx prisma db pull
```

### Database connection error
```bash
# Restart MySQL
docker-compose restart mysql

# Check MySQL logs
docker-compose logs mysql
```

### Port sudah digunakan
```bash
# Check port usage
sudo lsof -i :3000
sudo lsof -i :3306

# Kill process
sudo kill -9 <PID>
```

---

## Production Checklist

- [ ] Update semua password di `.env`
- [ ] Set `JWT_SECRET` yang kuat (min 32 karakter)
- [ ] Setup Nginx reverse proxy
- [ ] Install SSL certificate
- [ ] Setup firewall (UFW)
- [ ] Setup database backup otomatis
- [ ] Setup monitoring (optional: Prometheus, Grafana)
- [ ] Setup log rotation
- [ ] Test semua API endpoints
- [ ] Setup domain DNS

---

## Perbandingan: Docker vs Manual Deployment

### Keuntungan Docker:
✅ Konsisten di semua environment
✅ Mudah di-scale
✅ Isolasi dependencies
✅ Rollback mudah
✅ Setup cepat
✅ Include database dalam satu stack

### Keuntungan Manual:
✅ Lebih ringan (tanpa Docker overhead)
✅ Kontrol penuh atas system
✅ Debugging lebih mudah untuk pemula

**Rekomendasi: Gunakan Docker untuk production!**

---

## Support

Jika ada masalah, check:
1. Logs: `docker-compose logs -f`
2. Container status: `docker-compose ps`
3. Database connection: `docker-compose exec backend npx prisma db pull`
