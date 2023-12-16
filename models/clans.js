const {Schema} = require("mongoose") 
const mongoose = require("mongoose") 


const clanSetupSchema = new Schema({
  guild_id: {
    type: String,
    required: true
  },
  roleId: {
    type: String,
    required: true
  },
  categoryId: {
    type: String,
    required: true
  }
})


const clanSchema = new Schema({
  guild_id: {
    type: String,
    required: true
  },
  clanName: {
    type: String,
    required: true,
    unique: true
  },
  clanDesc: {
    type: String,
    default: "Не установлено"
  },
  clanBalance: {
    type: Number,
    default: 0
  },
  clanAvatar: {
    type: String,
    default: "https://i.pinimg.com/originals/be/d4/66/bed4660e8bdc8f39119fbe6587153059.gif"
  },
  clanOwner: {
    type: String,
    required: true,
  },
  clanDeputy: {
    type: Array,
    required: true
  },
  clanMembers: {
    type: Array,
    default: []
  },
  clanChat: {
    type: String,
    default: null
  },
  clanVoice: {
    type: String,
    default: null
  },
  clanRole: {
    type: String,
    default: null
  },
  clanRoleHex: {
    type: String, 
    default: null
  },
  clanLevel: {
    type: Number,
    default: 0
  },
  clanExp: {
    type: Number,
    default: 0
  },
  clanMaxSlots: {
    type: Number
  },
})

const clanSetupModel = mongoose.model('clansettings', clanSetupSchema)
const clanModel = mongoose.model('clans', clanSchema)


module.exports = {
  clanSetupModel,
  clanModel
}