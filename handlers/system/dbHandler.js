const fs = require('fs');
const sequelize = require('../../db')

module.exports.init = () => {
    let count = 0
    for (let dir of fs.readdirSync("models")){
      for (let file of fs.readdirSync(`./models/${dir}`).filter(f => f.endsWith('.js'))) {
        require(`../../models/${dir}/${file}`)
        count += 1
        sequelize.sync({alter: true})
      }
    }
    console.log("[DBHANDLER] количество итераций " + count.toString());
}