const { Client } = require("discord.js");
const { userModel, marryModel } = require("../../models/users");

/**
 * 
 * @param {String} userId 
 * @param {String} guildId 
 */

async function isUserCreated(guildId, userId) {
  const user = await userModel.findOne({ guild_id: guildId, user_id: userId });
  return !!user;
}


/**
 * 
 * @param {String} userId 
 * @param {String} guildId 
 */

async function createUser(userId, guildId) {
  await userModel.create({user_id: userId, guild_id: guildId})
}

/**
 *
 * @param {Client} client
 */

async function usersHandler(client) {
  let start = Date.now()
  const guilds = client.guilds.cache.map((guild) => guild);
  let count = 0
  for (let guild of guilds) {
    const members = await guild.members.fetch()

    members.forEach(async member => {
      const userExists = await isUserCreated(member.guild.id, member.user.id)
      if (!userExists && !member.user.bot ) {
        count += 1
        await createUser(member.user.id, member.guild.id)
      }
    });

    let end = (Date.now() - start) / 1000

    console.log("[USERSHANDLER.JS] время выполнения " + end);
  }
  
}

module.exports = { usersHandler };
