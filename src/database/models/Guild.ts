import mongoose, { Document, Schema } from 'mongoose';

export interface IGuild extends Document {
  guildId: string;
  guildName: string;
  prefix: string;
  premium: {
    enabled: boolean;
    tier: number;
    expiresAt?: Date;
  };
  
  // Moderation Settings
  moderation: {
    enabled: boolean;
    logChannel?: string;
    mutedRole?: string;
    autoMod: {
      enabled: boolean;
      antiSpam: boolean;
      antiCaps: boolean;
      antiLinks: boolean;
      antiInvites: boolean;
      antiMassMention: boolean;
      badWords: string[];
    };
  };
  
  // Anti-Raid Settings
  antiRaid: {
    enabled: boolean;
    raidMode: boolean;
    joinRateLimit: number;
    accountAgeMin: number;
    verificationChannel?: string;
    verificationRole?: string;
    lockdownRoles: string[];
  };
  
  // Welcome & Goodbye
  welcome: {
    enabled: boolean;
    channel?: string;
    message: string;
    embed: boolean;
  };
  goodbye: {
    enabled: boolean;
    channel?: string;
    message: string;
    embed: boolean;
  };
  
  // Auto Roles
  autoRoles: string[];
  
  // Leveling System
  leveling: {
    enabled: boolean;
    channel?: string;
    xpMultiplier: number;
  };
  
  // Music Settings
  music: {
    enabled: boolean;
    djRole?: string;
    maxQueueSize: number;
  };
  
  // Ticket System
  tickets: {
    enabled: boolean;
    category?: string;
    supportRoles: string[];
    transcriptChannel?: string;
  };
  
  // Reaction Roles
  reactionRoles: Array<{
    messageId: string;
    channelId: string;
    roles: Array<{
      emoji: string;
      roleId: string;
    }>;
  }>;
  
  // Custom Commands
  customCommands: Array<{
    name: string;
    response: string;
    embed: boolean;
  }>;
  
  // Starboard
  starboard: {
    enabled: boolean;
    channel?: string;
    threshold: number;
  };
  
  // Statistics
  stats: {
    commandsUsed: number;
    messagesLogged: number;
    moderationActions: number;
  };
  
  createdAt: Date;
  updatedAt: Date;
}

const GuildSchema = new Schema({
  guildId: { type: String, required: true, unique: true },
  guildName: { type: String, required: true },
  prefix: { type: String, default: '!' },
  premium: {
    enabled: { type: Boolean, default: false },
    tier: { type: Number, default: 0 },
    expiresAt: Date
  },
  moderation: {
    enabled: { type: Boolean, default: true },
    logChannel: String,
    mutedRole: String,
    autoMod: {
      enabled: { type: Boolean, default: true },
      antiSpam: { type: Boolean, default: true },
      antiCaps: { type: Boolean, default: true },
      antiLinks: { type: Boolean, default: false },
      antiInvites: { type: Boolean, default: true },
      antiMassMention: { type: Boolean, default: true },
      badWords: [String]
    }
  },
  antiRaid: {
    enabled: { type: Boolean, default: true },
    raidMode: { type: Boolean, default: false },
    joinRateLimit: { type: Number, default: 5 },
    accountAgeMin: { type: Number, default: 7 },
    verificationChannel: String,
    verificationRole: String,
    lockdownRoles: [String]
  },
  welcome: {
    enabled: { type: Boolean, default: false },
    channel: String,
    message: { type: String, default: 'Welcome {user} to {server}!' },
    embed: { type: Boolean, default: false }
  },
  goodbye: {
    enabled: { type: Boolean, default: false },
    channel: String,
    message: { type: String, default: 'Goodbye {user}!' },
    embed: { type: Boolean, default: false }
  },
  autoRoles: [String],
  leveling: {
    enabled: { type: Boolean, default: false },
    channel: String,
    xpMultiplier: { type: Number, default: 1 }
  },
  music: {
    enabled: { type: Boolean, default: true },
    djRole: String,
    maxQueueSize: { type: Number, default: 100 }
  },
  tickets: {
    enabled: { type: Boolean, default: false },
    category: String,
    supportRoles: [String],
    transcriptChannel: String
  },
  reactionRoles: [{
    messageId: String,
    channelId: String,
    roles: [{
      emoji: String,
      roleId: String
    }]
  }],
  customCommands: [{
    name: String,
    response: String,
    embed: Boolean
  }],
  starboard: {
    enabled: { type: Boolean, default: false },
    channel: String,
    threshold: { type: Number, default: 3 }
  },
  stats: {
    commandsUsed: { type: Number, default: 0 },
    messagesLogged: { type: Number, default: 0 },
    moderationActions: { type: Number, default: 0 }
  }
}, { timestamps: true });

export default mongoose.model<IGuild>('Guild', GuildSchema);
