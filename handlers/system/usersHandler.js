const {userModel} = require('../../models/users')
const {Client} = require('discord.js')


/**
 * 
 * @param {Client} client 
 */

async function userHandler (client) {
  let count = 0
  let i = 0
  for (let guild of client.guilds.cache) {
    i++
    for (let member of guild[i].members.cache) {
      const user = await userModel.findOne({guild_id: guild.id, user_id: member})
      if (user === null) {
        await userModel.create({user_id: member.id, guild_id: guild.id})
        count += 1
      } else {
        continue
      }
    }
  }
  console.log(`Количество итераций над пользователями: ${count}`);
}

module.exports = {userHandler}