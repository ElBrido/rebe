import { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction } from 'discord.js';
import { successEmbed, errorEmbed } from '../../utils/embeds';
import ModCase from '../../../database/models/ModCase';
import Guild from '../../../database/models/Guild';

export default {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a user from the server')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to kick')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for the kick')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.guild) return;

    const target = interaction.options.getUser('user', true);
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
        embeds: [errorEmbed('Error', 'You cannot kick yourself!')],
        ephemeral: true
      });
    }

    const interactionMember = interaction.member as any;
    if (member.roles.highest.position >= interactionMember.roles.highest.position) {
      return interaction.reply({
        embeds: [errorEmbed('Error', 'You cannot kick a user with equal or higher role than you!')],
        ephemeral: true
      });
    }

    try {
      await target.send({
        embeds: [errorEmbed(
          `You have been kicked from ${interaction.guild.name}`,
          `**Reason:** ${reason}\n**Moderator:** ${interaction.user.tag}`
        )]
      }).catch(() => {});

      await member.kick(reason);

      const caseId = await ModCase.countDocuments({ guildId: interaction.guild.id }) + 1;
      await ModCase.create({
        guildId: interaction.guild.id,
        caseId,
        type: 'kick',
        userId: target.id,
        moderatorId: interaction.user.id,
        reason,
        active: true
      });

      await Guild.findOneAndUpdate(
        { guildId: interaction.guild.id },
        { $inc: { 'stats.moderationActions': 1 } }
      );

      return interaction.reply({
        embeds: [successEmbed('User Kicked', `${target.tag} has been kicked.\n**Reason:** ${reason}`)]
      });
    } catch (error) {
      return interaction.reply({
        embeds: [errorEmbed('Error', 'Failed to kick the user!')],
        ephemeral: true
      });
    }
  }
};
