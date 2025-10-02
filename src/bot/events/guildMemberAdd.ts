import { Events, GuildMember, EmbedBuilder } from 'discord.js';
import { AuraClient } from '../client/AuraClient';
import { logger } from '../utils/logger';
import Guild from '../../database/models/Guild';
import { Colors } from '../utils/embeds';

const joinTimestamps = new Map<string, number[]>();

export default {
  name: Events.GuildMemberAdd,
  async execute(member: GuildMember, client: AuraClient) {
    try {
      const guildData = await Guild.findOne({ guildId: member.guild.id });
      if (!guildData) return;

      // Anti-Raid Protection
      if (guildData.antiRaid.enabled) {
        const now = Date.now();
        const timestamps = joinTimestamps.get(member.guild.id) || [];
        
        // Add current join
        timestamps.push(now);
        
        // Remove joins older than 10 seconds
        const recentJoins = timestamps.filter(t => now - t < 10000);
        joinTimestamps.set(member.guild.id, recentJoins);

        // Check if raid detected
        if (recentJoins.length >= guildData.antiRaid.joinRateLimit) {
          // Activate raid mode automatically
          await Guild.findOneAndUpdate(
            { guildId: member.guild.id },
            { 'antiRaid.raidMode': true }
          );

          // Notify admins
          const logChannel = guildData.moderation.logChannel;
          if (logChannel) {
            const channel = await member.guild.channels.fetch(logChannel);
            if (channel?.isTextBased()) {
              await channel.send({
                embeds: [new EmbedBuilder()
                  .setColor(Colors.ERROR)
                  .setTitle('🚨 Raid Detected!')
                  .setDescription(`**${recentJoins.length}** members joined in the last 10 seconds.\nRaid mode has been automatically activated.`)
                  .setTimestamp()]
              });
            }
          }

          // Kick the member if in raid mode
          if (guildData.antiRaid.raidMode) {
            await member.kick('Auto-kick: Raid protection');
            return;
          }
        }

        // Check account age
        const accountAge = (now - member.user.createdTimestamp) / (1000 * 60 * 60 * 24);
        if (accountAge < guildData.antiRaid.accountAgeMin && guildData.antiRaid.raidMode) {
          await member.kick(`Account too new (${accountAge.toFixed(1)} days old)`);
          return;
        }
      }

      // Auto Roles
      if (guildData.autoRoles.length > 0) {
        for (const roleId of guildData.autoRoles) {
          try {
            const role = await member.guild.roles.fetch(roleId);
            if (role) {
              await member.roles.add(role);
            }
          } catch (error) {
            logger.error('Error adding auto role:', error);
          }
        }
      }

      // Welcome Message
      if (guildData.welcome.enabled && guildData.welcome.channel) {
        const channel = await member.guild.channels.fetch(guildData.welcome.channel);
        if (channel?.isTextBased()) {
          let message = guildData.welcome.message
            .replace('{user}', `<@${member.id}>`)
            .replace('{username}', member.user.username)
            .replace('{server}', member.guild.name)
            .replace('{membercount}', member.guild.memberCount.toString());

          if (guildData.welcome.embed) {
            await channel.send({
              embeds: [new EmbedBuilder()
                .setColor(Colors.SUCCESS)
                .setTitle('Welcome!')
                .setDescription(message)
                .setThumbnail(member.user.displayAvatarURL())
                .setTimestamp()]
            });
          } else {
            await channel.send(message);
          }
        }
      }
    } catch (error) {
      logger.error('Error in guildMemberAdd event:', error);
    }
  }
};
