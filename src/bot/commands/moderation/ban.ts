import { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction } from 'discord.js';
import { successEmbed, errorEmbed } from '../../utils/embeds';
import ModCase from '../../../database/models/ModCase';
import Guild from '../../../database/models/Guild';

export default {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a user from the server')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to ban')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for the ban')
        .setRequired(false))
    .addIntegerOption(option =>
      option.setName('delete_days')
        .setDescription('Number of days of messages to delete (0-7)')
        .setMinValue(0)
        .setMaxValue(7)
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.guild) return;

    const target = interaction.options.getUser('user', true);
    const reason = interaction.options.getString('reason') || 'No reason provided';
    const deleteDays = interaction.options.getInteger('delete_days') || 0;

    const member = await interaction.guild.members.fetch(target.id).catch(() => null);

    if (!member) {
      return interaction.reply({
        embeds: [errorEmbed('Error', 'User not found in this server!')],
        ephemeral: true
      });
    }

    if (member.id === interaction.user.id) {
      return interaction.reply({
        embeds: [errorEmbed('Error', 'You cannot ban yourself!')],
        ephemeral: true
      });
    }

    if (member.id === interaction.guild.ownerId) {
      return interaction.reply({
        embeds: [errorEmbed('Error', 'You cannot ban the server owner!')],
        ephemeral: true
      });
    }

    const interactionMember = interaction.member as any;
    if (member.roles.highest.position >= interactionMember.roles.highest.position) {
      return interaction.reply({
        embeds: [errorEmbed('Error', 'You cannot ban a user with equal or higher role than you!')],
        ephemeral: true
      });
    }

    try {
      // Send DM to user before banning
      await target.send({
        embeds: [errorEmbed(
          `You have been banned from ${interaction.guild.name}`,
          `**Reason:** ${reason}\n**Moderator:** ${interaction.user.tag}`
        )]
      }).catch(() => {});

      // Ban the user
      await member.ban({ deleteMessageSeconds: deleteDays * 24 * 60 * 60, reason });

      // Create mod case
      const guildData = await Guild.findOne({ guildId: interaction.guild.id });
      const caseId = await ModCase.countDocuments({ guildId: interaction.guild.id }) + 1;
      
      await ModCase.create({
        guildId: interaction.guild.id,
        caseId,
        type: 'ban',
        userId: target.id,
        moderatorId: interaction.user.id,
        reason,
        active: true
      });

      // Update stats
      await Guild.findOneAndUpdate(
        { guildId: interaction.guild.id },
        { $inc: { 'stats.moderationActions': 1 } }
      );

      // Log to mod log channel
      if (guildData?.moderation.logChannel) {
        const logChannel = await interaction.guild.channels.fetch(guildData.moderation.logChannel);
        if (logChannel?.isTextBased()) {
          await logChannel.send({
            embeds: [successEmbed(
              `Case #${caseId} | Ban`,
              `**User:** ${target.tag} (${target.id})\n**Moderator:** ${interaction.user.tag}\n**Reason:** ${reason}`
            )]
          });
        }
      }

      return interaction.reply({
        embeds: [successEmbed('User Banned', `${target.tag} has been banned.\n**Reason:** ${reason}`)]
      });
    } catch (error) {
      return interaction.reply({
        embeds: [errorEmbed('Error', 'Failed to ban the user!')],
        ephemeral: true
      });
    }
  }
};
