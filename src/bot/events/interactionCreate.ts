import { Events, CommandInteraction, PermissionFlagsBits, Collection } from 'discord.js';
import { AuraClient } from '../client/AuraClient';
import { logger } from '../utils/logger';
import { errorEmbed } from '../utils/embeds';
import Guild from '../../database/models/Guild';

export default {
  name: Events.InteractionCreate,
  async execute(interaction: CommandInteraction, client: AuraClient) {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    // Check if command is dev only
    if (command.devOnly) {
      const devIds = JSON.parse(process.env.DEVELOPER_IDS || '[]');
      if (!devIds.includes(interaction.user.id)) {
        return interaction.reply({
          embeds: [errorEmbed('Access Denied', 'This command is only available to developers.')],
          ephemeral: true
        });
      }
    }

    // Check if command requires premium
    if (command.premium && interaction.guildId) {
      const guildData = await Guild.findOne({ guildId: interaction.guildId });
      if (!guildData?.premium.enabled) {
        return interaction.reply({
          embeds: [errorEmbed('Premium Required', 'This feature requires an active premium subscription.')],
          ephemeral: true
        });
      }
    }

    // Cooldown management
    const { cooldowns } = client;
    if (!cooldowns.has(command.data.name)) {
      cooldowns.set(command.data.name, new Collection<string, number>());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.data.name)!;
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(interaction.user.id)) {
      const expirationTime = timestamps.get(interaction.user.id)! + cooldownAmount;
      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        return interaction.reply({
          content: `⏱️ Please wait ${timeLeft.toFixed(1)} more seconds before using this command again.`,
          ephemeral: true
        });
      }
    }

    timestamps.set(interaction.user.id, now);
    setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

    try {
      await command.execute(interaction);
      
      // Update stats
      if (interaction.guildId) {
        await Guild.findOneAndUpdate(
          { guildId: interaction.guildId },
          { $inc: { 'stats.commandsUsed': 1 } }
        );
      }
    } catch (error) {
      logger.error(`Error executing command ${interaction.commandName}:`, error);
      const reply = {
        embeds: [errorEmbed('Error', 'There was an error executing this command!')],
        ephemeral: true
      };
      
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(reply);
      } else {
        await interaction.reply(reply);
      }
    }
  }
};
