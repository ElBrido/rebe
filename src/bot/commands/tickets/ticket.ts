import { SlashCommandBuilder, ChatInputCommandInteraction, ChannelType, PermissionFlagsBits } from 'discord.js';
import { successEmbed, errorEmbed } from '../../utils/embeds';
import Guild from '../../../database/models/Guild';

export default {
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Create a support ticket')
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for creating the ticket')
        .setRequired(true)),

  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.guild) return;

    const reason = interaction.options.getString('reason', true);
    const guildData = await Guild.findOne({ guildId: interaction.guild.id });

    if (!guildData?.tickets.enabled) {
      return interaction.reply({
        embeds: [errorEmbed('Tickets Disabled', 'The ticket system is not enabled on this server.')],
        ephemeral: true
      });
    }

    await interaction.deferReply({ ephemeral: true });

    try {
      const ticketName = `ticket-${interaction.user.username}-${Date.now()}`.toLowerCase();
      
      const channel = await interaction.guild.channels.create({
        name: ticketName,
        type: ChannelType.GuildText,
        parent: guildData.tickets.category || undefined,
        permissionOverwrites: [
          {
            id: interaction.guild.id,
            deny: [PermissionFlagsBits.ViewChannel]
          },
          {
            id: interaction.user.id,
            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory]
          },
          {
            id: interaction.client.user.id,
            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageChannels]
          }
        ]
      });

      // Add support roles
      for (const roleId of guildData.tickets.supportRoles) {
        const role = await interaction.guild.roles.fetch(roleId);
        if (role) {
          await channel.permissionOverwrites.create(role, {
            ViewChannel: true,
            SendMessages: true,
            ReadMessageHistory: true
          });
        }
      }

      await channel.send({
        embeds: [successEmbed(
          '🎫 Support Ticket Created',
          `**Created by:** ${interaction.user}\n**Reason:** ${reason}\n\nA staff member will be with you shortly. To close this ticket, use \`/close\`.`
        )]
      });

      return interaction.editReply({
        embeds: [successEmbed('Ticket Created', `Your ticket has been created: ${channel}`)]
      });
    } catch (error) {
      return interaction.editReply({
        embeds: [errorEmbed('Error', 'Failed to create ticket! Please contact an administrator.')]
      });
    }
  }
};
