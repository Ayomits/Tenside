const {DataTypes} = require('sequelize')
const sequelize = require('../../db')

const systemMessageModel = sequelize.define("system_messages", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  guild_id: {
    type: DataTypes.BIGINT,
    unique: true,
    defaultValue: 0
  },
  channel_id: {
    type: DataTypes.BIGINT,
    unique: true,
    defaultValue: 0
  }
})