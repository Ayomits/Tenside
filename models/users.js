const {Schema} = require("mongoose") 
const mongoose = require("mongoose") 

const userSchema = new Schema({
  guild_id: {
    type: String,
    required: true
  },
  user_id : {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    default: 0
  },
  lvl: {
    type: Number,
    default: 0
  },
  xp: {
    type: Number,
    default: 0
  },
  married: {
    type: String,
    default: null
  },
  reputation: {
    type: Number,
    default: 0
  },
  voiceActive: {
    type: Date
  }
})

const timelySchema = new Schema({
  guild_id: {
    type: String,
    required: true
  },
  user_id : {
    type: String,
    required: true,
   },
 
})

const TimelyModel = mongoose.model("UsersTimely", timelySchema)
const userModel = mongoose.model("user", userSchema)

module.exports = {
  userModel,
  TimelyModel
}