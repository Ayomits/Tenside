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

const systemAnketaQuestion = sequelize.define('system_anketa_question', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  type: {
    type: DataTypes.STRING,
    unique:true
  },
  question1: {
    type: DataTypes.STRING,
  },
  question2: {
    type: DataTypes.STRING,
  }
})

const systemAnketaModalIDS = sequelize.define("system_anketa_modal_ids", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  customId: {
    type: DataTypes.STRING,
    unique:true
  }
})

const systemAnketaRecrutChannel = sequelize.define("system_anketa_channel", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  channel_id: {
    type: DataTypes.STRING,
    unique:true
  },
  guild_id: {
    type: DataTypes.STRING,
    unique:true
  }
})

module.exports = {
  systemMessageModel,
  systemAnketa,
  systemAnketaEmbed, 
  systemAnketaQuestion,
  systemAnketaModalIDS, 
  systemAnketaRecrutChannel
};