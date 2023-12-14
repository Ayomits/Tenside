import { Schema, Document } from "mongoose";
import mongoose from "mongoose";

export interface SystemMessages extends Document {
  guild_id: string,
  channel_id: string
}

export interface SystemAnketaEmbed extends Document {
  guild_id: string,
  title: string,
  description: string,
  color: string,
  imageLink: string
}

export interface SystemAnketaRecrutChannel extends Document {
  guild_id: string,
  channel_id: string
}

const systemMessageModelSchema = new Schema<SystemMessages>({
  guild_id: {
    type: String,
    required: true
  },
  channel_id: {
    type: String,
    required: true
  }
}) // тут просто схему это определяь

const systemAnketaEmbedSchema = new Schema<SystemAnketaEmbed> ({
  guild_id: {
    type: String,
    require: true,
    unique: true
  },
  title: {
    type: String,
    require: true
  },
  description: {
    type: String,
    require: true
  },
  color: {
    type: String,
    require: true
  },
  imageLink: {
    type: String,
    require: false
  }
}) // тут просто схему это определяь

const systemAnketaRecrutChannelSchema = new Schema<SystemAnketaRecrutChannel>({
  guild_id: {
    type: String,
    required: true
  },
  channel_id: {
    type: String,
    required: true
  } 
}) 

export const systemMessageModel = mongoose.model("SystemMessageModel", systemMessageModelSchema) 
export const systemAnketaEmbed = mongoose.model("SystemAnketaEmbed", systemAnketaEmbedSchema)
export const systemAnketaRecrutChannel = mongoose.model("SystemAnketaRecrutChannel", systemAnketaRecrutChannelSchema) 

