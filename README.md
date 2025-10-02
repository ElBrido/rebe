# 🌟 Aura Bot - Professional Multi-Guild Discord Bot

A comprehensive, professional Discord bot with advanced features including moderation, anti-raid protection, music, tickets, leveling, and a full web dashboard with premium features and developer panel.

## ✨ Features

### 🛡️ Advanced Moderation
- Complete moderation commands (ban, kick, warn, mute, unmute)
- Automatic moderation (spam, caps, links, invites, mass mentions)
- Bad word filtering
- Detailed moderation logs and case management
- Configurable settings per server

### 🔒 Anti-Raid Protection
- Intelligent raid detection based on join rate
- Automatic raid mode activation
- Account age verification
- Channel lockdown system
- Configurable protection levels

### 👋 Welcome & Goodbye System
- Customizable welcome messages
- Customizable goodbye messages
- Embed support
- Variable support ({user}, {server}, {membercount}, etc.)

### 🎭 Auto Roles
- Assign roles automatically on member join
- Multiple roles support
- Easy configuration via dashboard

### 📊 Leveling System
- XP-based leveling system
- Per-guild level tracking
- Configurable XP multiplier
- Level-up announcements
- Leaderboards

### 🎵 Music System
- High-quality music playback
- Queue management
- DJ role support
- Volume control
- Skip, pause, resume functionality

### 🎫 Ticket System
- Professional support ticket system
- Transcript generation
- Support role management
- Custom categories
- Easy close/reopen

### 🌟 Premium Features
- Enhanced customization options
- Custom embeds
- Advanced auto-moderation
- Unlimited custom commands
- Priority support
- Premium badge
- API access

### 🖥️ Web Dashboard
- Modern, responsive web interface
- Discord OAuth2 authentication
- Easy server configuration
- Real-time statistics
- Module enable/disable toggles
- Live audit logs

### 👨‍💻 Developer Panel
- Secure admin authentication
- View all servers
- Global bot statistics
- Premium management (grant/revoke)
- User/guild blacklist management
- System monitoring

## 🚀 Installation

### Prerequisites
- Node.js v16 or higher
- MongoDB database
- Discord Bot Token
- Discord OAuth2 credentials (for dashboard)

### Setup

1. Clone the repository:
```bash
git clone https://github.com/ElBrido/rebe.git
cd rebe
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Configure your `.env` file with:
   - Discord bot token
   - Discord OAuth2 credentials
   - MongoDB connection URI
   - Session secrets
   - Stripe keys (for premium)
   - Developer credentials

5. Build the project:
```bash
npm run build
```

6. Start the bot:
```bash
npm start
```

## 📝 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DISCORD_TOKEN` | Your Discord bot token | ✅ |
| `DISCORD_CLIENT_ID` | Discord application client ID | ✅ |
| `DISCORD_CLIENT_SECRET` | Discord OAuth2 client secret | ✅ |
| `MONGODB_URI` | MongoDB connection string | ✅ |
| `SESSION_SECRET` | Secret for session encryption | ✅ |
| `JWT_SECRET` | Secret for JWT tokens | ✅ |
| `DEVELOPER_IDS` | JSON array of developer Discord IDs | ✅ |
| `DEVELOPER_PASSWORD` | Password for developer panel | ✅ |
| `STRIPE_SECRET_KEY` | Stripe secret key (optional) | ❌ |
| `DASHBOARD_PORT` | Port for dashboard (default: 3000) | ❌ |

### Bot Permissions

The bot requires the following permissions:
- Administrator (or specific permissions)
- View Channels
- Send Messages
- Embed Links
- Attach Files
- Read Message History
- Add Reactions
- Use External Emojis
- Manage Messages
- Manage Roles
- Manage Channels
- Kick Members
- Ban Members
- Manage Server

## 📚 Commands

### Moderation Commands
- `/ban` - Ban a user from the server
- `/kick` - Kick a user from the server
- `/warn` - Warn a user
- `/mute` - Mute a user
- `/unmute` - Unmute a user
- `/clear` - Clear messages from a channel

### Anti-Raid Commands
- `/raidmode` - Toggle raid mode on/off
- `/lockdown` - Lock or unlock a channel
- `/verify` - Verification system management

### Utility Commands
- `/help` - Display all commands
- `/serverinfo` - Show server information
- `/userinfo` - Show user information
- `/stats` - Display bot statistics

### Configuration Commands
- `/setup` - Initial server setup
- `/config` - View/edit configuration
- `/prefix` - Change bot prefix

### Fun Commands
- `/poll` - Create a poll
- `/giveaway` - Start a giveaway
- `/8ball` - Ask the magic 8-ball

## 🌐 Dashboard

Access the web dashboard at `http://localhost:3000` (or your configured port).

### Features:
- Server selection and management
- Module configuration (moderation, anti-raid, welcome, etc.)
- Real-time statistics
- Audit logs
- Premium management
- Developer panel

## 💎 Premium

Premium tiers unlock advanced features:

### Basic ($4.99/month)
- Custom embeds
- Advanced auto-moderation
- Custom welcome/goodbye images
- 50 custom commands
- Priority support

### Pro ($9.99/month)
- Everything in Basic
- Unlimited custom commands
- Advanced leveling customization
- Custom economy system
- API access

### Enterprise (Custom)
- Everything in Pro
- Dedicated support
- Custom bot branding
- SLA guarantee

## 👨‍💻 Development

### Project Structure
```
rebe/
├── src/
│   ├── bot/
│   │   ├── client/        # Bot client
│   │   ├── commands/      # Command modules
│   │   ├── events/        # Event handlers
│   │   └── utils/         # Utility functions
│   ├── dashboard/
│   │   ├── routes/        # Dashboard routes
│   │   ├── views/         # EJS templates
│   │   └── public/        # Static files
│   └── database/
│       └── models/        # MongoDB models
├── .env.example
├── package.json
└── tsconfig.json
```

### Building
```bash
npm run build
```

### Development Mode
```bash
npm run dev
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the ISC License.

## 🔗 Links

- [Dashboard](https://aura.bot/dashboard)
- [Support Server](https://discord.gg/aura)
- [Premium Plans](https://aura.bot/premium)

## 📞 Support

Need help? Join our [support server](https://discord.gg/aura) or open an issue on GitHub.

---

Made with ❤️ by the Aura Bot Team
