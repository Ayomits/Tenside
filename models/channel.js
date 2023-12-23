const {Schema} = require("mongoose") 
const mongoose = require("mongoose") 

const channel = new Schema({
  guild_id: {
    type: String,
    required: true
  },
  channel_id : {
    type: String,
    required: true,
   },
  
})
const voice = new Schema({
  guild_id: {
    type: String,
    required: true
  },
  channel_id : {
    type: String,
    required: true,
   },
  
})
const channelModel = mongoose.model("channels", channel)
const voiceModel = mongoose.model("voices", voice)

module.exports = {
  channelModel, voiceModel
}