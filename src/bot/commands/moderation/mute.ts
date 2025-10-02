import { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction } from 'discord.js';
import { successEmbed, errorEmbed } from '../../utils/embeds';
import ModCase from '../../../database/models/ModCase';
import Guild from '../../../database/models/Guild';

export default {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Timeout a user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to mute')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('duration')
        .setDescription('Duration in minutes')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(40320))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for the mute')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.guild) return;

    const target = interaction.options.getUser('user', true);
    const duration = interaction.options.getInteger('duration', true);
    const reason = interaction.options.getString('reason') || 'No reason provided';

    const member = await interaction.guild.members.fetch(target.id).catch(() => null);

    if (!member) {
      return interaction.reply({
        embeds: [errorEmbed('Error', 'User not found in this server!')],
        ephemeral: true
      });
    }

    if (member.id === interaction.user.id) {
      return interaction.reply({
        embeds: [errorEmbed('Error', 'You cannot mute yourself!')],
        ephemeral: true
      });
    }

    const interactionMember = interaction.member as any;
    if (member.roles.highest.position >= interactionMember.roles.highest.position) {
      return interaction.reply({
        embeds: [errorEmbed('Error', 'You cannot mute a user with equal or higher role than you!')],
        ephemeral: true
      });
    }

    try {
      await member.timeout(duration * 60 * 1000, reason);

      const caseId = await ModCase.countDocuments({ guildId: interaction.guild.id }) + 1;
      await ModCase.create({
        guildId: interaction.guild.id,
        caseId,
        type: 'mute',
        userId: target.id,
        moderatorId: interaction.user.id,
        reason,
        duration: duration * 60,
        active: true
      });

      await Guild.findOneAndUpdate(
        { guildId: interaction.guild.id },
        { $inc: { 'stats.moderationActions': 1 } }
      );

      await target.send({
        embeds: [errorEmbed(
          `You have been muted in ${interaction.guild.name}`,
          `**Duration:** ${duration} minutes\n**Reason:** ${reason}\n**Moderator:** ${interaction.user.tag}`
        )]
      }).catch(() => {});

      return interaction.reply({
        embeds: [successEmbed(
          'User Muted',
          `${target.tag} has been muted for ${duration} minutes.\n**Reason:** ${reason}`
        )]
      });
    } catch (error) {
      return interaction.reply({
        embeds: [errorEmbed('Error', 'Failed to mute the user!')],
        ephemeral: true
      });
    }
  }
};
