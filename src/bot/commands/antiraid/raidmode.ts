import { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction } from 'discord.js';
import { successEmbed, errorEmbed } from '../../utils/embeds';
import Guild from '../../../database/models/Guild';

export default {
  data: new SlashCommandBuilder()
    .setName('raidmode')
    .setDescription('Toggle raid mode on/off')
    .addBooleanOption(option =>
      option.setName('enabled')
        .setDescription('Enable or disable raid mode')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.guild) return;

    const enabled = interaction.options.getBoolean('enabled', true);

    try {
      await Guild.findOneAndUpdate(
        { guildId: interaction.guild.id },
        { 'antiRaid.raidMode': enabled },
        { upsert: true }
      );

      if (enabled) {
        // Set verification level to highest
        await interaction.guild.setVerificationLevel(4, 'Raid mode activated');
      } else {
        // Set verification level back to medium
        await interaction.guild.setVerificationLevel(2, 'Raid mode deactivated');
      }

      return interaction.reply({
        embeds: [successEmbed(
          'Raid Mode Updated',
          `Raid mode has been **${enabled ? 'enabled' : 'disabled'}**.\n\n${enabled ? '🛡️ Server is now in lockdown mode. New members will be heavily restricted.' : '✅ Server restrictions have been lifted.'}`
        )]
      });
    } catch (error) {
      return interaction.reply({
        embeds: [errorEmbed('Error', 'Failed to update raid mode!')],
        ephemeral: true
      });
    }
  }
};
