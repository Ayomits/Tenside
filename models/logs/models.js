const sequelize = require('../../db')
const { DataTypes } = require('sequelize')

const logs = sequelize.define("logs", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  guild_id: {
    type: DataTypes.BIGINT,
  },
  channel_id: {
    type: DataTypes.BIGINT,
    unique: true
  },
  type_: {
    type: DataTypes.STRING,
  }
})