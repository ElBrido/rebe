# Deployment Guide for Aura Bot

This guide covers different deployment methods for the Aura Discord Bot.

## Prerequisites

- Node.js v16 or higher
- MongoDB instance
- Discord Bot Token
- Discord OAuth2 Application

## Local Development

### 1. Clone and Install

```bash
git clone https://github.com/ElBrido/rebe.git
cd rebe
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Required variables:
- `DISCORD_TOKEN` - Your bot token from Discord Developer Portal
- `DISCORD_CLIENT_ID` - Your application client ID
- `DISCORD_CLIENT_SECRET` - Your OAuth2 client secret
- `MONGODB_URI` - MongoDB connection string
- `SESSION_SECRET` - Random secure string
- `JWT_SECRET` - Random secure string
- `DEVELOPER_IDS` - Array of developer Discord IDs
- `DEVELOPER_PASSWORD` - Password for developer panel

### 3. Build and Run

```bash
# Build the project
npm run build

# Start the bot
npm start
```

For development with hot reload:
```bash
npm run dev
```

## Docker Deployment

### Using Docker Compose (Recommended)

1. **Configure Environment**

Edit `docker-compose.yml` and update MongoDB credentials if needed.

2. **Start Services**

```bash
docker-compose up -d
```

This will start:
- MongoDB database
- Discord bot
- Web dashboard (accessible at http://localhost:3000)

3. **View Logs**

```bash
# Bot logs
docker-compose logs -f bot

# Dashboard logs
docker-compose logs -f dashboard

# All logs
docker-compose logs -f
```

4. **Stop Services**

```bash
docker-compose down
```

### Manual Docker Build

**Build Bot:**
```bash
docker build -t aura-bot -f Dockerfile .
docker run -d --env-file .env aura-bot
```

**Build Dashboard:**
```bash
docker build -t aura-dashboard -f Dockerfile.dashboard .
docker run -d -p 3000:3000 --env-file .env aura-dashboard
```

## Production Deployment

### VPS/Cloud Server (Ubuntu/Debian)

1. **Install Dependencies**

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# Install PM2 (Process Manager)
sudo npm install -g pm2
```

2. **Setup Bot**

```bash
# Clone repository
git clone https://github.com/ElBrido/rebe.git
cd rebe

# Install dependencies
npm install

# Configure environment
cp .env.example .env
nano .env  # Edit with your values

# Build project
npm run build
```

3. **Start with PM2**

```bash
# Start bot
pm2 start dist/index.js --name aura-bot

# Start dashboard
pm2 start dist/dashboard/index.js --name aura-dashboard

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

4. **Configure Nginx (Optional - for Dashboard)**

```bash
# Install Nginx
sudo apt install -y nginx

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/aura-bot
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/aura-bot /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

5. **Setup SSL with Certbot**

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### Heroku Deployment

1. **Install Heroku CLI**

```bash
npm install -g heroku
heroku login
```

2. **Create Heroku Apps**

```bash
# Create bot app
heroku create aura-bot-yourname

# Create dashboard app
heroku create aura-dashboard-yourname

# Add MongoDB addon
heroku addons:create mongolab:sandbox -a aura-bot-yourname
heroku addons:create mongolab:sandbox -a aura-dashboard-yourname
```

3. **Configure Environment Variables**

```bash
# Bot
heroku config:set DISCORD_TOKEN=your_token -a aura-bot-yourname
heroku config:set DISCORD_CLIENT_ID=your_id -a aura-bot-yourname
# ... add all other variables

# Dashboard
heroku config:set DISCORD_TOKEN=your_token -a aura-dashboard-yourname
# ... add all other variables
```

4. **Deploy**

```bash
git push heroku main
```

## Monitoring and Maintenance

### PM2 Commands

```bash
# View status
pm2 status

# View logs
pm2 logs aura-bot
pm2 logs aura-dashboard

# Restart
pm2 restart aura-bot
pm2 restart aura-dashboard

# Stop
pm2 stop aura-bot
pm2 stop aura-dashboard

# Monitor resources
pm2 monit
```

### Database Backup

```bash
# Backup MongoDB
mongodump --uri="mongodb://localhost:27017/aura-bot" --out=/backup/$(date +%Y%m%d)

# Restore MongoDB
mongorestore --uri="mongodb://localhost:27017/aura-bot" /backup/20240101
```

### Updating the Bot

```bash
# Pull latest changes
git pull

# Install dependencies
npm install

# Build
npm run build

# Restart services
pm2 restart all
```

## Security Best Practices

1. **Never commit `.env` file** - It contains sensitive credentials
2. **Use strong passwords** - For MongoDB and developer panel
3. **Enable MongoDB authentication** - Don't use default settings in production
4. **Use HTTPS** - Always use SSL/TLS for dashboard
5. **Regularly update dependencies** - Run `npm audit` and fix vulnerabilities
6. **Limit bot permissions** - Only give necessary permissions
7. **Rate limiting** - Already configured for API endpoints
8. **Firewall rules** - Only expose necessary ports (80, 443 for dashboard)

## Troubleshooting

### Bot won't start

1. Check if all environment variables are set
2. Verify MongoDB is running: `systemctl status mongod`
3. Check logs: `pm2 logs aura-bot`
4. Verify bot token is valid

### Dashboard not accessible

1. Check if dashboard is running: `pm2 status`
2. Verify port 3000 is not blocked by firewall
3. Check Nginx configuration if using reverse proxy
4. Verify OAuth2 callback URL matches your setup

### Commands not registering

1. Wait up to 1 hour for global commands to sync
2. Check bot has `applications.commands` scope
3. Verify bot is online and has proper permissions
4. Check logs for errors during command registration

### Database connection issues

1. Verify MongoDB is running
2. Check MongoDB URI in .env
3. Ensure MongoDB accepts connections from your IP
4. Check MongoDB authentication credentials

## Support

For additional help:
- [Documentation](https://docs.aura.bot)
- [Support Server](https://discord.gg/aura)
- [GitHub Issues](https://github.com/ElBrido/rebe/issues)
