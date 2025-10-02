import { Client, Collection, GatewayIntentBits, Partials } from 'discord.js';
import { readdirSync } from 'fs';
import path from 'path';
import { logger } from '../utils/logger';

export interface Command {
  data: any;
  execute: (interaction: any) => Promise<void>;
  cooldown?: number;
  premium?: boolean;
  devOnly?: boolean;
}

export class AuraClient extends Client {
  public commands: Collection<string, Command>;
  public cooldowns: Collection<string, Collection<string, number>>;

  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.MessageContent
      ],
      partials: [
        Partials.Message,
        Partials.Channel,
        Partials.Reaction,
        Partials.User,
        Partials.GuildMember
      ]
    });

    this.commands = new Collection();
    this.cooldowns = new Collection();
  }

  public async loadCommands(): Promise<void> {
    const commandsPath = path.join(__dirname, '../commands');
    const commandFolders = readdirSync(commandsPath);

    for (const folder of commandFolders) {
      const commandFiles = readdirSync(path.join(commandsPath, folder))
        .filter(file => file.endsWith('.ts') || file.endsWith('.js'));

      for (const file of commandFiles) {
        try {
          const command = require(path.join(commandsPath, folder, file)).default;
          if (command && command.data && command.execute) {
            this.commands.set(command.data.name, command);
            logger.info(`✅ Loaded command: ${command.data.name}`);
          }
        } catch (error) {
          logger.error(`❌ Error loading command ${file}:`, error);
        }
      }
    }
  }

  public async loadEvents(): Promise<void> {
    const eventsPath = path.join(__dirname, '../events');
    const eventFiles = readdirSync(eventsPath)
      .filter(file => file.endsWith('.ts') || file.endsWith('.js'));

    for (const file of eventFiles) {
      try {
        const event = require(path.join(eventsPath, file)).default;
        if (event.once) {
          this.once(event.name, (...args) => event.execute(...args, this));
        } else {
          this.on(event.name, (...args) => event.execute(...args, this));
        }
        logger.info(`✅ Loaded event: ${event.name}`);
      } catch (error) {
        logger.error(`❌ Error loading event ${file}:`, error);
      }
    }
  }
}
