import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { Colors } from '../../utils/embeds';
import Guild from '../../../database/models/Guild';

export default {
  data: new SlashCommandBuilder()
    .setName('premium')
    .setDescription('View premium information and status'),

  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.guild) return;

    const guildData = await Guild.findOne({ guildId: interaction.guild.id });
    
    const embed = new EmbedBuilder()
      .setColor(Colors.PREMIUM)
      .setTitle('⭐ Aura Premium')
      .setDescription('Unlock advanced features and customization for your server!');

    if (guildData?.premium.enabled) {
      const expiresAt = guildData.premium.expiresAt;
      const expiryText = expiresAt 
        ? `<t:${Math.floor(expiresAt.getTime() / 1000)}:R>`
        : 'Never';

      embed.addFields(
        { name: '✅ Premium Status', value: 'Active', inline: true },
        { name: '🏆 Tier', value: `Tier ${guildData.premium.tier}`, inline: true },
        { name: '📅 Expires', value: expiryText, inline: true }
      );
    } else {
      embed.addFields(
        { name: '❌ Premium Status', value: 'Not Active', inline: false },
        { 
          name: '💎 Basic - $4.99/month', 
          value: '• Custom embeds\n• Advanced auto-moderation\n• Custom welcome images\n• 50 custom commands\n• Priority support' 
        },
        { 
          name: '🌟 Pro - $9.99/month', 
          value: '• Everything in Basic\n• Unlimited custom commands\n• Advanced leveling\n• Custom economy\n• API access' 
        },
        { 
          name: '🚀 Enterprise - Custom', 
          value: '• Everything in Pro\n• Dedicated support\n• Custom branding\n• SLA guarantee' 
        }
      );
    }

    embed.addFields({
      name: '🔗 Get Premium',
      value: '[Visit our website](https://aura.bot/premium) to upgrade!'
    });

    return interaction.reply({ embeds: [embed] });
  }
};
