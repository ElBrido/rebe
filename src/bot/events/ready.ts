import { Events, ActivityType } from 'discord.js';
import { AuraClient } from '../client/AuraClient';
import { logger } from '../utils/logger';

export default {
  name: Events.ClientReady,
  once: true,
  async execute(client: AuraClient) {
    logger.info(`✅ ${client.user?.tag} is online!`);
    logger.info(`📊 Serving ${client.guilds.cache.size} guilds`);
    logger.info(`👥 Serving ${client.users.cache.size} users`);

    // Set bot status
    client.user?.setPresence({
      activities: [{ 
        name: `/help | ${client.guilds.cache.size} servers`,
        type: ActivityType.Watching 
      }],
      status: 'online'
    });

    // Update presence every 5 minutes
    setInterval(() => {
      const activities = [
        { name: `/help | ${client.guilds.cache.size} servers`, type: ActivityType.Watching },
        { name: 'Keeping servers safe', type: ActivityType.Playing },
        { name: 'Premium features available!', type: ActivityType.Playing },
        { name: 'aura.bot/dashboard', type: ActivityType.Watching }
      ];

      const activity = activities[Math.floor(Math.random() * activities.length)];
      client.user?.setPresence({
        activities: [activity],
        status: 'online'
      });
    }, 5 * 60 * 1000);
  }
};
