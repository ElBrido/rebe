import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  userId: string;
  username: string;
  discriminator: string;
  
  // Premium
  premium: {
    enabled: boolean;
    tier: number;
    expiresAt?: Date;
  };
  
  // Global Stats
  globalStats: {
    commandsUsed: number;
    guildsJoined: number;
  };
  
  // Leveling (per guild)
  levels: Array<{
    guildId: string;
    xp: number;
    level: number;
    messages: number;
  }>;
  
  // Economy (per guild)
  economy: Array<{
    guildId: string;
    coins: number;
    bank: number;
  }>;
  
  blacklisted: boolean;
  blacklistReason?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema({
  userId: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  discriminator: { type: String, required: true },
  premium: {
    enabled: { type: Boolean, default: false },
    tier: { type: Number, default: 0 },
    expiresAt: Date
  },
  globalStats: {
    commandsUsed: { type: Number, default: 0 },
    guildsJoined: { type: Number, default: 0 }
  },
  levels: [{
    guildId: String,
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 0 },
    messages: { type: Number, default: 0 }
  }],
  economy: [{
    guildId: String,
    coins: { type: Number, default: 0 },
    bank: { type: Number, default: 0 }
  }],
  blacklisted: { type: Boolean, default: false },
  blacklistReason: String
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
