import { Schema, Document } from "mongoose";
import mongoose from "mongoose";

export interface CasinoSchema extends Document {
  guild_id: string,
  balance: number
}

const casinoSchema = new Schema<CasinoSchema>({
  guild_id: {
    type: String,
    required: true
  },
  balance : {
    type: Number,
    default: 500000,
   },
  
})

export const casinoModel = mongoose.model("casino", casinoSchema)

