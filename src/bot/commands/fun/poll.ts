import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { Colors } from '../../utils/embeds';

export default {
  data: new SlashCommandBuilder()
    .setName('poll')
    .setDescription('Create a poll')
    .addStringOption(option =>
      option.setName('question')
        .setDescription('The poll question')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('options')
        .setDescription('Poll options separated by commas (max 10)')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('duration')
        .setDescription('Duration in minutes (optional)')
        .setMinValue(1)
        .setMaxValue(1440)
        .setRequired(false)),

  async execute(interaction: ChatInputCommandInteraction) {
    const question = interaction.options.getString('question', true);
    const optionsStr = interaction.options.getString('options', true);
    const duration = interaction.options.getInteger('duration');

    const options = optionsStr.split(',').map(o => o.trim()).filter(o => o.length > 0);

    if (options.length < 2) {
      return interaction.reply({
        content: '❌ You need at least 2 options for a poll!',
        ephemeral: true
      });
    }

    if (options.length > 10) {
      return interaction.reply({
        content: '❌ Maximum 10 options allowed!',
        ephemeral: true
      });
    }

    const emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
    
    const optionsText = options.map((option, index) => 
      `${emojis[index]} ${option}`
    ).join('\n');

    const embed = new EmbedBuilder()
      .setColor(Colors.INFO)
      .setTitle('📊 ' + question)
      .setDescription(optionsText)
      .setFooter({ text: `Poll by ${interaction.user.tag}` })
      .setTimestamp();

    if (duration) {
      embed.addFields({ 
        name: '⏱️ Duration', 
        value: `${duration} minutes` 
      });
    }

    await interaction.reply({ embeds: [embed] });
    
    const message = await interaction.fetchReply();
    
    for (let i = 0; i < options.length; i++) {
      await message.react(emojis[i]);
    }
  }
};
