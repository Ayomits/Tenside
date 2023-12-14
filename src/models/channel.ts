import { Schema, Document } from "mongoose";
import mongoose from "mongoose";

export interface Channel extends Document {
  guild_id: string,
  channel_id: string
}

const channel = new Schema<Channel>({
  guild_id: {
    type: String,
    required: true
  },
  channel_id : {
    type: String,
    required: true,
   },
  
})

export const channelModel = mongoose.model("channels", channel)

