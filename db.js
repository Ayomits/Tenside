const {Sequelize, DataTypes} = require('sequelize')

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "db.sqlite3"
})

module.exports = sequelize