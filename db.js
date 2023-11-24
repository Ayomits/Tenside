const {Sequelize, DataTypes} = require('sequelize')

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "db.sqlite",
  logging: false,
  host: "localhost"

})

module.exports = sequelize