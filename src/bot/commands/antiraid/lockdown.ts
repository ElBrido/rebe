import { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction, ChannelType } from 'discord.js';
import { successEmbed, errorEmbed } from '../../utils/embeds';

export default {
  data: new SlashCommandBuilder()
    .setName('lockdown')
    .setDescription('Lock or unlock a channel')
    .addBooleanOption(option =>
      option.setName('locked')
        .setDescription('Lock or unlock the channel')
        .setRequired(true))
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('The channel to lock/unlock')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.guild) return;

    const channel = interaction.options.getChannel('channel') || interaction.channel;
    const locked = interaction.options.getBoolean('locked', true);

    if (!channel || channel.type !== ChannelType.GuildText) {
      return interaction.reply({
        embeds: [errorEmbed('Error', 'Invalid channel!')],
        ephemeral: true
      });
    }

    try {
      const textChannel = await interaction.guild.channels.fetch(channel.id);
      if (!textChannel || textChannel.type !== ChannelType.GuildText) {
        return interaction.reply({
          embeds: [errorEmbed('Error', 'Invalid channel!')],
          ephemeral: true
        });
      }
      
      await textChannel.permissionOverwrites.edit(interaction.guild.id, {
        SendMessages: !locked
      });

      return interaction.reply({
        embeds: [successEmbed(
          'Channel Lockdown',
          `<#${textChannel.id}> has been **${locked ? 'locked' : 'unlocked'}**.`
        )]
      });
    } catch (error) {
      return interaction.reply({
        embeds: [errorEmbed('Error', 'Failed to update channel permissions!')],
        ephemeral: true
      });
    }
  }
};
