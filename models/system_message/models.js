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

const systemAnketa = sequelize.define('system_anketa', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  question: {
    type: DataTypes.STRING,
  }, 
  type_: {
    type: DataTypes.STRING,
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
    type: DataTypes.STRING
  },
  imageLink: {
    type: DataTypes.STRING
  }
})



module.exports = {
  systemMessageModel,
  systemAnketa,
  systemAnketaEmbed
};