import { Schema, Document } from "mongoose";
import mongoose from "mongoose";

export interface User extends Document {
  guild_id: string,
  user_id: string,
  balance: number,
  lvl: number,
  xp: number,
  reputation: number,
  voiceActive: number,
  messageCount: number,
  status: string
}

export interface Timely extends Document {
  guild_id: string,
  user_id: string
}

export interface Marry extends Document {
  guild_id: string,
  partner1_id: string,
  partner2_id: string,
  created_at: string,
  marry_points: number,
  
}

export interface Work extends Document {
  guild_id: string,
  user_id: string,
  next_work: Date
}

const userSchema = new Schema<User>({
  guild_id: {
    type: String,
    required: true,
  },
  user_id: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    default: 0,
  },
  lvl: {
    type: Number,
    default: 0,
  },
  xp: {
    type: Number,
    default: 0,
  },
  reputation: {
    type: Number,
    default: 0,
  },
  voiceActive: {
    type: Number,
    default: 0
  },
  messageCount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    default: "Статус не установлен.",
    maxLenght: 40
  }
});

const timelySchema = new Schema<Timely>({
  guild_id: {
    type: String,
    required: true,
  },
  user_id: {
    type: String,
    required: true,
  },
});

const marrySchema = new Schema<Marry>({
  guild_id: {
    type: String,
    required: true,
  },
  partner1_id: {
    type: String,
    required: true,
  },
  partner2_id: {
    type: String,
    required: true,
  },
  created_at: {
    type: String,
    required: true,
    default: String(Date.now()),
  },
  marry_points: {
    type: Number,
    default: 0,
    required: true,
  },
});

const workSchema  = new Schema<Work>({
  guild_id: {
    type: String, 
    required: true
  },
  user_id: {
    type: String, 
    required: true
  },
  next_work: {
    type: Date,
    required: true
  }
});

export const TimelyModel = mongoose.model("UsersTimely", timelySchema);
export const userModel = mongoose.model("user", userSchema);
export const marryModel = mongoose.model("marrypoints", marrySchema);
export const workModel = mongoose.model('work', workSchema)


export default {
  TimelyModel,
  userModel,
  marryModel,
  workModel
}
