const mongoose = require('mongoose')


const customRoleSettingsSchema = new mongoose.Schema({
  guild_id: {
    type: String,
    required: true
  },
  roleId: {
    type: String,
    required: true
  }
}) 

const customRoleSchema = new mongoose.Schema({
  guild_id: {
    type: String,
    required: true
  },
  user_id: {
    type: String,
    required: true
  },
  roleName: {
    type: String,
    default: "Custom role"
  },
  roleHex: {
    type: String,
    default: "#111111"
  },
  roleId: {
    type: String
  }
})


const CustomRoleSettingsModel = mongoose.model('customrolessettings', customRoleSettingsSchema)
const CustomRolesModel = mongoose.model('customrolesmodel', customRoleSchema)

module.exports = {
  CustomRoleSettingsModel,
  CustomRolesModel
}