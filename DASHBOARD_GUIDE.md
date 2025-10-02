# Dashboard Configuration Guide

## Overview

The Aura Bot dashboard is now fully functional with complete configuration pages for all bot features and a comprehensive developer panel. This guide explains how to use each section.

## Configuration Pages

### 1. Moderation Settings
**URL:** `/dashboard/{guildId}/moderation`

Configure moderation and auto-moderation features:
- **Enable/Disable:** Toggle the moderation module on/off
- **Log Channel:** Set where moderation actions are logged
- **Muted Role:** Configure the role for muted members
- **Auto-Moderation:**
  - Anti-Spam: Detect and prevent message spam
  - Anti-Caps: Block excessive capital letters
  - Anti-Links: Block external links
  - Anti-Invites: Block Discord server invites
  - Anti-Mass Mention: Prevent mass mentions/pings
  - Bad Words Filter: Custom list of filtered words

### 2. Anti-Raid Protection
**URL:** `/dashboard/{guildId}/antiraid`

Protect your server from raids:
- **Join Rate Limit:** Max members per minute (default: 5)
- **Minimum Account Age:** Required account age in days (default: 7)
- **Verification System:** Channel and role for member verification
- **Lockdown Roles:** Roles that bypass lockdown restrictions
- **Raid Mode:** Visual indicator when raid mode is active

### 3. Welcome & Goodbye Messages
**URL:** `/dashboard/{guildId}/welcome`

Customize member join/leave messages:
- **Welcome Messages:**
  - Channel selection
  - Custom message with variables
  - Embed formatting option
- **Goodbye Messages:**
  - Channel selection
  - Custom message with variables
  - Embed formatting option
- **Variables:** `{user}`, `{username}`, `{server}`

### 4. Auto Roles
**URL:** `/dashboard/{guildId}/autoroles`

Automatically assign roles to new members:
- Configure multiple roles (comma-separated IDs)
- Visual list of current auto roles
- Simple add/remove interface

### 5. Leveling System
**URL:** `/dashboard/{guildId}/leveling`

Manage the XP and leveling system:
- **Enable/Disable:** Toggle leveling system
- **Announcement Channel:** Where level-up messages are sent
- **XP Multiplier:** Adjust XP gain rate (0.1 - 10.0)
- **System Info:** Built-in documentation for commands

### 6. Music Settings
**URL:** `/dashboard/{guildId}/music`

Configure music player settings:
- **Enable/Disable:** Toggle music module
- **DJ Role:** Role that can control the player
- **Max Queue Size:** Maximum songs in queue (10-1000)
- **Commands:** List of available music commands

### 7. Ticket System
**URL:** `/dashboard/{guildId}/tickets`

Set up support ticket system:
- **Enable/Disable:** Toggle ticket system
- **Ticket Category:** Category for ticket channels
- **Support Roles:** Roles that can view/manage tickets
- **Transcript Channel:** Where closed ticket logs are sent

### 8. Custom Commands
**URL:** `/dashboard/{guildId}/custom-commands`

Create custom bot commands:
- **Add Commands:** Name, response, and embed option
- **Manage Commands:** Visual list with delete functionality
- **Dynamic:** Commands work immediately after creation

## Developer Panel

### Accessing the Dev Panel

1. Add your Discord ID to the `DEVELOPER_IDS` environment variable:
   ```
   DEVELOPER_IDS=["123456789012345678"]
   ```

2. Log in to the dashboard with your Discord account

3. A red "🔧 Dev Panel" button will appear in the header

### Dev Panel Features

#### Overview Page (`/dev`)
- **Global Statistics:**
  - Total guilds using the bot
  - Premium guilds count
  - Total users count
  - Premium adoption rate
- **Top 10 Guilds:** Sorted by command usage
- **Quick Actions:**
  - Grant premium to any guild
  - Revoke premium access
  - Blacklist problematic users

#### Guild Management (`/dev/guilds`)
- Paginated list of all guilds
- Guild statistics and info
- Per-guild actions:
  - View guild dashboard
  - Grant/revoke premium
  - Set premium tier (1-3)
  - Set premium duration

## API Endpoints

### User Endpoints
- `GET /api/guild/:guildId` - Fetch guild settings
- `POST /api/guild/:guildId` - Update guild settings
- `GET /api/guild/:guildId/stats` - Guild statistics
- `GET /api/guild/:guildId/cases` - Moderation cases

### Developer Endpoints
- `POST /api/dev/premium/grant` - Grant premium (dev only)
- `POST /api/dev/premium/revoke` - Revoke premium (dev only)
- `POST /api/dev/blacklist/user` - Blacklist user (dev only)

## Environment Variables

Required configuration in `.env`:

```bash
# Discord OAuth
DISCORD_CLIENT_ID=your_client_id
DISCORD_CLIENT_SECRET=your_client_secret
DISCORD_CALLBACK_URL=http://localhost:3000/auth/discord/callback

# Dashboard
DASHBOARD_PORT=3000
SESSION_SECRET=your_session_secret
JWT_SECRET=your_jwt_secret

# Developer Access
DEVELOPER_IDS=["your_discord_id"]
DEVELOPER_PASSWORD=your_dev_password

# Database
MONGODB_URI=mongodb://localhost:27017/aura-bot
```

## Building & Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run dashboard
```

The build script automatically:
1. Compiles TypeScript to JavaScript
2. Copies EJS views to `dist/dashboard/views/`
3. Copies CSS/assets to `dist/dashboard/public/`

## Features Summary

### User Features
✅ 8 Complete configuration pages
✅ Real-time form validation
✅ Auto-save with confirmation
✅ Contextual help text
✅ Toggle switches for easy enable/disable
✅ Professional UI with consistent styling

### Developer Features
✅ Visual dev panel with statistics
✅ Guild management interface
✅ Premium management tools
✅ User blacklist system
✅ Secure access control
✅ Quick action modals

### Technical Features
✅ TypeScript with strict mode
✅ MongoDB integration
✅ Express.js routing
✅ EJS templating
✅ Client-side JavaScript
✅ Responsive design
✅ No breaking changes

## Support

For issues or questions:
1. Check the documentation above
2. Review environment variables
3. Check MongoDB connection
4. Verify Discord OAuth credentials
5. Ensure proper permissions

## Security Notes

- Developer IDs are checked server-side
- Session-based authentication for web
- JWT tokens for API calls
- No exposure of sensitive data
- Access control on all dev endpoints
- Graceful error handling

---

**Status:** Production Ready ✅
**Version:** 1.0.0
**Last Updated:** 2024
