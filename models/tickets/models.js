const {DataTypes} = require('sequelize')
const sequelize = require('../../db')


const ticketSettings = sequelize.define("ticket_settings", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  guild_id: {
    type: DataTypes.STRING,
    unique: true
  },
  channel_id: {
    type: DataTypes.STRING,
    unique: true
  }
})

module.exports = {
  ticketSettings,
}