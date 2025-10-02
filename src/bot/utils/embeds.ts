import { EmbedBuilder } from 'discord.js';

export const Colors = {
  SUCCESS: 0x00ff00,
  ERROR: 0xff0000,
  WARNING: 0xffff00,
  INFO: 0x0099ff,
  PREMIUM: 0xffd700
};

export function successEmbed(title: string, description: string): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(Colors.SUCCESS)
    .setTitle(title)
    .setDescription(description)
    .setTimestamp();
}

export function errorEmbed(title: string, description: string): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(Colors.ERROR)
    .setTitle(title)
    .setDescription(description)
    .setTimestamp();
}

export function warningEmbed(title: string, description: string): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(Colors.WARNING)
    .setTitle(title)
    .setDescription(description)
    .setTimestamp();
}

export function infoEmbed(title: string, description: string): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(Colors.INFO)
    .setTitle(title)
    .setDescription(description)
    .setTimestamp();
}
