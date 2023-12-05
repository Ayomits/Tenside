const {Client} = require('discord.js')
const {userModel} = require('../../models/users')

/**
 * 
 * @param {Client} client 
 */

async function usersHandler (client) {
  const guilds = client.guilds.cache

  for (let guild of guilds) {
    const members = await guild[1].members.fetch()
    let count = 0
    
    for (let member of members) {
      const user = await userModel.findOne({guild_id: guild[1].id, user_id: member[1].user.id})
      if (!user) {
        if (member[1].user.bot) {
          continue
        }else{
        try {
          await userModel.create({guild_id: guild[1].id, user_id: member[1].user.id})
        }
        catch (err) {}
        count += 1
      }
    }
    }
    
    console.log(`[USERHANDLER] кол-во итераций ${count}`);
  }
}

module.exports = {usersHandler}
