# Quick Start Guide - Aura Bot

Get your Aura bot up and running in minutes!

## Prerequisites

Before you begin, make sure you have:

1. **Node.js v16+** installed ([Download here](https://nodejs.org/))
2. **MongoDB** installed or access to MongoDB Atlas ([Get started](https://www.mongodb.com/cloud/atlas))
3. **Discord Bot** created in Discord Developer Portal
4. **Discord OAuth2 Application** set up

## Step 1: Create Discord Application

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and give it a name (e.g., "Aura Bot")
3. Go to "Bot" tab and click "Add Bot"
4. Copy your bot token (you'll need this later)
5. Enable these **Privileged Gateway Intents**:
   - ✅ Presence Intent
   - ✅ Server Members Intent
   - ✅ Message Content Intent
6. Go to "OAuth2" → "General"
   - Copy your **Client ID**
   - Copy your **Client Secret**
   - Add redirect URL: `http://localhost:3000/auth/discord/callback`

## Step 2: Invite Bot to Your Server

Use this URL (replace YOUR_CLIENT_ID):
```
https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=8&scope=bot%20applications.commands
```

## Step 3: Install and Configure

```bash
# Clone the repository
git clone https://github.com/ElBrido/rebe.git
cd rebe

# Install dependencies
npm install

# Copy environment template
cp .env.example .env
```

## Step 4: Configure Environment

Edit `.env` file with your values:

```env
# Required Discord Settings
DISCORD_TOKEN=your_bot_token_here
DISCORD_CLIENT_ID=your_client_id_here
DISCORD_CLIENT_SECRET=your_client_secret_here
DISCORD_CALLBACK_URL=http://localhost:3000/auth/discord/callback

# MongoDB (use local or MongoDB Atlas)
MONGODB_URI=mongodb://localhost:27017/aura-bot

# Generate random strings for these (use password generator)
SESSION_SECRET=random_string_here
JWT_SECRET=another_random_string_here

# Your Discord User ID (for developer access)
DEVELOPER_IDS=["YOUR_DISCORD_USER_ID"]
DEVELOPER_PASSWORD=secure_password_here

# Your Discord ID (same as above)
BOT_OWNER_ID=YOUR_DISCORD_USER_ID
```

### How to get your Discord User ID:
1. Enable Developer Mode in Discord (Settings → Advanced → Developer Mode)
2. Right-click your username
3. Click "Copy ID"

## Step 5: Build and Start

```bash
# Build the TypeScript code
npm run build

# Start the bot
npm start
```

The bot should now be online! You should see:
```
✅ Connected to MongoDB successfully
✅ Successfully reloaded X application (/) commands
✅ aura-bot#1234 is online!
```

## Step 6: Access Dashboard

Open your browser and go to:
```
http://localhost:3000
```

Click "Login with Discord" to access the dashboard!

## Quick Commands Test

In your Discord server, try these commands:

- `/help` - View all commands
- `/serverinfo` - View server information
- `/userinfo` - View user information
- `/poll question:"Test poll" options:"Yes, No, Maybe"` - Create a poll
- `/premium` - View premium information

## For Admins/Moderators

- `/ban @user reason:"Breaking rules"` - Ban a user
- `/kick @user reason:"Warning"` - Kick a user
- `/warn @user reason:"Spam"` - Warn a user
- `/clear amount:10` - Delete 10 messages
- `/raidmode enabled:true` - Enable raid protection
- `/lockdown locked:true` - Lock current channel

## Troubleshooting

### Bot doesn't respond to commands
- Wait up to 1 hour for slash commands to sync globally
- Make sure bot has proper permissions
- Check bot is online in Discord

### Dashboard shows no servers
- Make sure you logged in with Discord
- Verify you have "Manage Server" permission
- Check if bot is in the server

### Database connection error
- Make sure MongoDB is running: `mongod` or check MongoDB Atlas
- Verify MONGODB_URI in .env is correct

### Commands not working
- Check bot has Administrator permission or specific command permissions
- Verify bot role is higher than roles it's trying to manage

## Development Mode

For development with auto-reload:

```bash
npm run dev
```

## Docker Quick Start

If you prefer Docker:

```bash
# Start everything (bot + dashboard + MongoDB)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop everything
docker-compose down
```

## Next Steps

1. **Configure your server** - Use `/setup` or visit the dashboard
2. **Set up moderation** - Configure auto-mod rules in dashboard
3. **Customize welcome messages** - Dashboard → Welcome/Goodbye
4. **Enable features** - Toggle modules in dashboard
5. **Explore premium** - Visit `/premium` to see premium features

## Getting Help

- Read the full [README.md](README.md) for detailed documentation
- Check [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment
- Join our support server (update link in code)
- Open an issue on GitHub

## Important Security Notes

⚠️ **Never share your `.env` file or bot token!**
- The `.env` file is already in `.gitignore`
- Never commit tokens to version control
- Regenerate tokens if exposed

## Features to Explore

✅ **Moderation** - Ban, kick, warn, mute, clear messages
✅ **Anti-Raid** - Automatic raid detection and protection
✅ **Welcome System** - Custom welcome/goodbye messages
✅ **Leveling** - XP and levels per server
✅ **Tickets** - Support ticket system
✅ **Custom Commands** - Create your own commands
✅ **Dashboard** - Web-based configuration
✅ **Premium System** - Multiple tier support
✅ **Developer Panel** - Manage all servers

Enjoy your Aura bot! 🌟
