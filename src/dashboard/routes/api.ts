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
