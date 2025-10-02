import express from 'express';
import jwt from 'jsonwebtoken';
import Guild from '../../database/models/Guild';
import User from '../../database/models/User';

const router = express.Router();

// Developer authentication middleware
function isDevAuthenticated(req: express.Request, res: express.Response, next: express.NextFunction) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// Developer login
router.post('/login', async (req, res) => {
  try {
    const { password } = req.body;
    
    const validPassword = password === process.env.DEVELOPER_PASSWORD;
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { role: 'developer' },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get all guilds
router.get('/guilds', isDevAuthenticated, async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = (page - 1) * limit;

    const guilds = await Guild.find()
      .sort({ 'stats.commandsUsed': -1 })
      .skip(skip)
      .limit(limit);

    const total = await Guild.countDocuments();

    res.json({
      guilds,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch guilds' });
  }
});

// Get guild details
router.get('/guilds/:guildId', isDevAuthenticated, async (req, res) => {
  try {
    const guild = await Guild.findOne({ guildId: req.params.guildId });
    res.json(guild);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch guild' });
  }
});

// Grant premium
router.post('/premium/grant', isDevAuthenticated, async (req, res) => {
  try {
    const { guildId, tier, days } = req.body;
    
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + days);

    await Guild.findOneAndUpdate(
      { guildId },
      {
        'premium.enabled': true,
        'premium.tier': tier,
        'premium.expiresAt': expiresAt
      }
    );

    res.json({ success: true, message: 'Premium granted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to grant premium' });
  }
});

// Revoke premium
router.post('/premium/revoke', isDevAuthenticated, async (req, res) => {
  try {
    const { guildId } = req.body;

    await Guild.findOneAndUpdate(
      { guildId },
      {
        'premium.enabled': false,
        'premium.tier': 0,
        $unset: { 'premium.expiresAt': 1 }
      }
    );

    res.json({ success: true, message: 'Premium revoked' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to revoke premium' });
  }
});

// Blacklist user
router.post('/blacklist/user', isDevAuthenticated, async (req, res) => {
  try {
    const { userId, reason } = req.body;

    await User.findOneAndUpdate(
      { userId },
      { blacklisted: true, blacklistReason: reason },
      { upsert: true }
    );

    res.json({ success: true, message: 'User blacklisted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to blacklist user' });
  }
});

// Global statistics
router.get('/stats', isDevAuthenticated, async (req, res) => {
  try {
    const totalGuilds = await Guild.countDocuments();
    const premiumGuilds = await Guild.countDocuments({ 'premium.enabled': true });
    const totalUsers = await User.countDocuments();
    
    const topGuilds = await Guild.find()
      .sort({ 'stats.commandsUsed': -1 })
      .limit(10)
      .select('guildName stats');

    res.json({
      totalGuilds,
      premiumGuilds,
      totalUsers,
      topGuilds
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export default router;
