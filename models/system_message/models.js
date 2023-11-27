const {DataTypes} = require('sequelize')
const sequelize = require('../../db')

const systemMessageModel = sequelize.define("system_messages", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  guild_id: {
    type: DataTypes.STRING,
    unique: true,
    defaultValue: 0
  },
  channel_id: {
    type: DataTypes.STRING,
    unique: true,
    defaultValue: 0
  }
})

const systemAnketaEmbed = sequelize.define('system_anketa_embed', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  guild_id: {
    type: DataTypes.STRING,
    unique: true,
    defaultValue: 0
  },
  title: {
    type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.STRING,
  },
  color: {
    type: DataTypes.STRING,
    defaultValue: ""
  },
  imageLink: {
    type: DataTypes.STRING
  }
})

const systemAnketaRecrutChannel = sequelize.define("system_anketa_channel", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  channel_id: {
    type: DataTypes.STRING,
    unique:true,
    defaultValue: ""
  },
  guild_id: {
    type: DataTypes.STRING,
    unique:true,
    defaultValue: ""
  }
})

module.exports = {
  systemMessageModel,
  systemAnketaEmbed,  
  systemAnketaRecrutChannel
};