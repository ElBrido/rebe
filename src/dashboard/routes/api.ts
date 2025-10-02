import express from 'express';
import Guild from '../../database/models/Guild';
import User from '../../database/models/User';
import ModCase from '../../database/models/ModCase';

const router = express.Router();

// Middleware
function isAuthenticated(req: express.Request, res: express.Response, next: express.NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Unauthorized' });
}

// Check if user is a developer
function isDeveloper(req: express.Request, res: express.Response, next: express.NextFunction) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const user: any = req.user;
  const developerIds = JSON.parse(process.env.DEVELOPER_IDS || '[]');
  
  if (developerIds.includes(user.id)) {
    return next();
  }
  
  res.status(403).json({ error: 'Developer privileges required' });
}

// Developer API endpoints
router.post('/dev/premium/grant', isDeveloper, async (req, res) => {
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
      },
      { upsert: true }
    );

    res.json({ success: true, message: 'Premium granted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to grant premium' });
  }
});

router.post('/dev/premium/revoke', isDeveloper, async (req, res) => {
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

router.post('/dev/blacklist/user', isDeveloper, async (req, res) => {
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

// Get guild settings
router.get('/guild/:guildId', isAuthenticated, async (req, res) => {
  try {
    const guild = await Guild.findOne({ guildId: req.params.guildId });
    res.json(guild || {});
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update guild settings
router.post('/guild/:guildId', isAuthenticated, async (req, res) => {
  try {
    const guildId = req.params.guildId;
    const updates = req.body;

    const guild = await Guild.findOneAndUpdate(
      { guildId },
      updates,
      { new: true, upsert: true }
    );

    res.json({ success: true, guild });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// Get guild stats
router.get('/guild/:guildId/stats', isAuthenticated, async (req, res) => {
  try {
    const guildId = req.params.guildId;
    const guild = await Guild.findOne({ guildId });
    const modCases = await ModCase.countDocuments({ guildId });
    
    res.json({
      stats: guild?.stats || {},
      totalCases: modCases
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Get mod cases
router.get('/guild/:guildId/cases', isAuthenticated, async (req, res) => {
  try {
    const cases = await ModCase.find({ guildId: req.params.guildId })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(cases);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cases' });
  }
});

export default router;
