import { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction } from 'discord.js';
import { successEmbed, errorEmbed } from '../../utils/embeds';
import ModCase from '../../../database/models/ModCase';
import Guild from '../../../database/models/Guild';

export default {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warn a user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to warn')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for the warning')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.guild) return;

    const target = interaction.options.getUser('user', true);
    const reason = interaction.options.getString('reason', true);

    try {
      const caseId = await ModCase.countDocuments({ guildId: interaction.guild.id }) + 1;
      
      await ModCase.create({
        guildId: interaction.guild.id,
        caseId,
        type: 'warn',
        userId: target.id,
        moderatorId: interaction.user.id,
        reason,
        active: true
      });

      await Guild.findOneAndUpdate(
        { guildId: interaction.guild.id },
        { $inc: { 'stats.moderationActions': 1 } }
      );

      await target.send({
        embeds: [errorEmbed(
          `You have been warned in ${interaction.guild.name}`,
          `**Reason:** ${reason}\n**Moderator:** ${interaction.user.tag}`
        )]
      }).catch(() => {});

      return interaction.reply({
        embeds: [successEmbed('User Warned', `${target.tag} has been warned.\n**Reason:** ${reason}`)]
      });
    } catch (error) {
      return interaction.reply({
        embeds: [errorEmbed('Error', 'Failed to warn the user!')],
        ephemeral: true
      });
    }
  }
};
