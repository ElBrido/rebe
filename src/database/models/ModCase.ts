import mongoose, { Document, Schema } from 'mongoose';

export interface IModCase extends Document {
  guildId: string;
  caseId: number;
  type: 'warn' | 'mute' | 'unmute' | 'kick' | 'ban' | 'unban';
  userId: string;
  moderatorId: string;
  reason: string;
  duration?: number;
  active: boolean;
  createdAt: Date;
}

const ModCaseSchema = new Schema({
  guildId: { type: String, required: true },
  caseId: { type: Number, required: true },
  type: { type: String, required: true, enum: ['warn', 'mute', 'unmute', 'kick', 'ban', 'unban'] },
  userId: { type: String, required: true },
  moderatorId: { type: String, required: true },
  reason: { type: String, required: true },
  duration: Number,
  active: { type: Boolean, default: true }
}, { timestamps: true });

ModCaseSchema.index({ guildId: 1, caseId: 1 }, { unique: true });

export default mongoose.model<IModCase>('ModCase', ModCaseSchema);
