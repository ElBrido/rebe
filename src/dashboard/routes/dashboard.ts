import express from 'express';
import axios from 'axios';
import Guild from '../../database/models/Guild';

const router = express.Router();

// Middleware to check if user is authenticated
function isAuthenticated(req: express.Request, res: express.Response, next: express.NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/auth/discord');
}

// Dashboard home - server selection
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const user: any = req.user;
    
    // Get user's guilds from Discord
    const guildsResponse = await axios.get('https://discord.com/api/v10/users/@me/guilds', {
      headers: {
        Authorization: `Bearer ${user.accessToken}`
      }
    }).catch(() => ({ data: [] }));

    const userGuilds = guildsResponse.data;
    
    // Filter guilds where user has MANAGE_GUILD permission
    const manageableGuilds = userGuilds.filter((guild: any) => 
      (BigInt(guild.permissions) & BigInt(0x20)) === BigInt(0x20)
    );

    res.render('dashboard/servers', { 
      user: req.user,
      guilds: manageableGuilds
    });
  } catch (error) {
    res.status(500).render('error', { error, user: req.user });
  }
});

// Guild dashboard
router.get('/:guildId', isAuthenticated, async (req, res) => {
  try {
    const guildId = req.params.guildId;
    const user: any = req.user;

    // Verify user has access to this guild
    const guildsResponse = await axios.get('https://discord.com/api/v10/users/@me/guilds', {
      headers: {
        Authorization: `Bearer ${user.accessToken}`
      }
    }).catch(() => ({ data: [] }));

    const hasAccess = guildsResponse.data.some((g: any) => 
      g.id === guildId && (BigInt(g.permissions) & BigInt(0x20)) === BigInt(0x20)
    );

    if (!hasAccess) {
      return res.status(403).render('error', { 
        error: { message: 'Access denied to this server' },
        user: req.user 
      });
    }

    // Get guild data from database
    let guildData = await Guild.findOne({ guildId });
    if (!guildData) {
      guildData = await Guild.create({
        guildId,
        guildName: 'Unknown Server'
      });
    }

    res.render('dashboard/guild', { 
      user: req.user,
      guild: guildData
    });
  } catch (error) {
    res.status(500).render('error', { error, user: req.user });
  }
});

// Module pages
router.get('/:guildId/moderation', isAuthenticated, async (req, res) => {
  const guildData = await Guild.findOne({ guildId: req.params.guildId });
  res.render('dashboard/moderation', { user: req.user, guild: guildData });
});

router.get('/:guildId/antiraid', isAuthenticated, async (req, res) => {
  const guildData = await Guild.findOne({ guildId: req.params.guildId });
  res.render('dashboard/antiraid', { user: req.user, guild: guildData });
});

router.get('/:guildId/welcome', isAuthenticated, async (req, res) => {
  const guildData = await Guild.findOne({ guildId: req.params.guildId });
  res.render('dashboard/welcome', { user: req.user, guild: guildData });
});

router.get('/:guildId/autoroles', isAuthenticated, async (req, res) => {
  const guildData = await Guild.findOne({ guildId: req.params.guildId });
  res.render('dashboard/autoroles', { user: req.user, guild: guildData });
});

router.get('/:guildId/leveling', isAuthenticated, async (req, res) => {
  const guildData = await Guild.findOne({ guildId: req.params.guildId });
  res.render('dashboard/leveling', { user: req.user, guild: guildData });
});

router.get('/:guildId/music', isAuthenticated, async (req, res) => {
  const guildData = await Guild.findOne({ guildId: req.params.guildId });
  res.render('dashboard/music', { user: req.user, guild: guildData });
});

router.get('/:guildId/tickets', isAuthenticated, async (req, res) => {
  const guildData = await Guild.findOne({ guildId: req.params.guildId });
  res.render('dashboard/tickets', { user: req.user, guild: guildData });
});

router.get('/:guildId/custom-commands', isAuthenticated, async (req, res) => {
  const guildData = await Guild.findOne({ guildId: req.params.guildId });
  res.render('dashboard/custom-commands', { user: req.user, guild: guildData });
});

export default router;
