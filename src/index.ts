import dotenv from 'dotenv';
dotenv.config();

import { AuraClient } from './bot/client/AuraClient';
import { connectDatabase } from './database';
import { logger } from './bot/utils/logger';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import { readdirSync } from 'fs';
import path from 'path';

async function main() {
  try {
    // Connect to database
    await connectDatabase();

    // Initialize bot client
    const client = new AuraClient();

    // Load commands and events
    await client.loadCommands();
    await client.loadEvents();

    // Register slash commands
    const commands: any[] = [];
    const commandsPath = path.join(__dirname, 'bot/commands');
    const commandFolders = readdirSync(commandsPath);

    for (const folder of commandFolders) {
      const commandFiles = readdirSync(path.join(commandsPath, folder))
        .filter(file => file.endsWith('.ts') || file.endsWith('.js'));

      for (const file of commandFiles) {
        try {
          const command = require(path.join(commandsPath, folder, file)).default;
          if (command && command.data) {
            commands.push(command.data.toJSON());
          }
        } catch (error) {
          logger.error(`Error loading command for registration ${file}:`, error);
        }
      }
    }

    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);

    logger.info('🔄 Started refreshing application (/) commands...');

    await rest.put(
      Routes.applicationCommands(process.env.DISCORD_CLIENT_ID!),
      { body: commands }
    );

    logger.info(`✅ Successfully reloaded ${commands.length} application (/) commands.`);

    // Login to Discord
    await client.login(process.env.DISCORD_TOKEN);
  } catch (error) {
    logger.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

// Handle process events
process.on('unhandledRejection', (error) => {
  logger.error('Unhandled promise rejection:', error);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception:', error);
  process.exit(1);
});

main();
