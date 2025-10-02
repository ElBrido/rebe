import { Events, Guild as DiscordGuild } from 'discord.js';
import { AuraClient } from '../client/AuraClient';
import { logger } from '../utils/logger';
import Guild from '../../database/models/Guild';

export default {
  name: Events.GuildCreate,
  async execute(guild: DiscordGuild, client: AuraClient) {
    logger.info(`✅ Joined new guild: ${guild.name} (${guild.id})`);

    // Create guild entry in database
    try {
      await Guild.findOneAndUpdate(
        { guildId: guild.id },
        {
          guildId: guild.id,
          guildName: guild.name,
          prefix: '!',
          premium: {
            enabled: false,
            tier: 0
          }
        },
        { upsert: true, new: true }
      );

      logger.info(`📝 Created database entry for guild: ${guild.name}`);
    } catch (error) {
      logger.error('Error creating guild database entry:', error);
    }

    // Try to send welcome message
    try {
      const channel = guild.systemChannel || guild.channels.cache.find(c => c.isTextBased());
      if (channel && channel.isTextBased()) {
        await channel.send({
          embeds: [{
            color: 0x0099ff,
            title: '👋 Thanks for adding Aura!',
            description: 'I\'m a professional multi-guild Discord bot with tons of features!\n\n**Get Started:**\n• Use `/help` to see all commands\n• Use `/setup` to configure the bot\n• Visit our [Dashboard](https://aura.bot/dashboard) for easy configuration\n\n**Features:**\n🛡️ Advanced Moderation\n🔒 Anti-Raid Protection\n🎵 Music Player\n🎫 Ticket System\n⭐ Leveling & Economy\n📊 Server Statistics\n...and much more!\n\n**Premium:** Unlock advanced features at [aura.bot/premium](https://aura.bot/premium)',
            footer: { text: 'Need help? Join our support server!' }
          }]
        });
      }
    } catch (error) {
      logger.error('Error sending welcome message:', error);
    }
  }
};
