import { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction, TextChannel } from 'discord.js';
import { successEmbed, errorEmbed } from '../../utils/embeds';

export default {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Clear messages from a channel')
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('Number of messages to delete (1-100)')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(100))
    .addUserOption(option =>
      option.setName('user')
        .setDescription('Only delete messages from this user')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction: ChatInputCommandInteraction) {
    const amount = interaction.options.getInteger('amount', true);
    const targetUser = interaction.options.getUser('user');

    await interaction.deferReply({ ephemeral: true });

    try {
      const channel = interaction.channel as TextChannel;
      
      let messages = await channel.messages.fetch({ limit: amount });

      if (targetUser) {
        messages = messages.filter(m => m.author.id === targetUser.id);
      }

      const deleted = await channel.bulkDelete(messages, true);

      return interaction.editReply({
        embeds: [successEmbed(
          'Messages Cleared',
          `Successfully deleted ${deleted.size} message(s)${targetUser ? ` from ${targetUser.tag}` : ''}.`
        )]
      });
    } catch (error) {
      return interaction.editReply({
        embeds: [errorEmbed('Error', 'Failed to delete messages! Messages older than 14 days cannot be bulk deleted.')]
      });
    }
  }
};
