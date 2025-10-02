import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { Colors } from '../../utils/embeds';

export default {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Display bot commands and features'),

  async execute(interaction: ChatInputCommandInteraction) {
    const embed = new EmbedBuilder()
      .setColor(Colors.INFO)
      .setTitle('🌟 Aura Bot - Command List')
      .setDescription('Professional multi-guild Discord bot with advanced features')
      .addFields(
        {
          name: '🛡️ Moderation',
          value: '`/ban` - Ban a user\n`/kick` - Kick a user\n`/warn` - Warn a user\n`/mute` - Mute a user\n`/unmute` - Unmute a user\n`/clear` - Clear messages',
          inline: true
        },
        {
          name: '🔒 Anti-Raid',
          value: '`/raidmode` - Toggle raid mode\n`/lockdown` - Lock/unlock channels\n`/verify` - Verification system',
          inline: true
        },
        {
          name: '⚙️ Configuration',
          value: '`/setup` - Server setup\n`/prefix` - Change prefix\n`/config` - View configuration',
          inline: true
        },
        {
          name: '🎵 Music',
          value: '`/play` - Play music\n`/skip` - Skip song\n`/queue` - View queue\n`/volume` - Adjust volume',
          inline: true
        },
        {
          name: '🎫 Tickets',
          value: '`/ticket` - Create ticket\n`/close` - Close ticket\n`/add` - Add user to ticket',
          inline: true
        },
        {
          name: '⭐ Premium Features',
          value: '`/premium` - View premium info\n`/customembed` - Custom embeds\n`/automod` - Advanced automod',
          inline: true
        },
        {
          name: '📊 Statistics',
          value: '`/stats` - Server stats\n`/userinfo` - User information\n`/serverinfo` - Server info',
          inline: true
        },
        {
          name: '🎮 Fun & Games',
          value: '`/poll` - Create poll\n`/giveaway` - Start giveaway\n`/8ball` - Magic 8-ball',
          inline: true
        },
        {
          name: '🔗 Links',
          value: '[Dashboard](https://aura.bot/dashboard) • [Support](https://discord.gg/aura) • [Premium](https://aura.bot/premium)',
          inline: false
        }
      )
      .setFooter({ text: 'Use /command for more info on each command' })
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  }
};
