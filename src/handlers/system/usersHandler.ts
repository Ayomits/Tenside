import { Client } from "discord.js";

import { userModel, marryModel } from "../../models/users";

/**
 * 
 * @param {String} userId 
 * @param {String} guildId 
 */

export async function isUserCreated(guildId: string, userId: string) {
  const user = await userModel.findOne({ guild_id: guildId, user_id: userId });
  return !!user;
}


/**
 * 
 * @param {String} userId 
 * @param {String} guildId 
 */

export async function createUser(userId: string, guildId: string) {
  await userModel.create({user_id: userId, guild_id: guildId})
}

/**
 *
 * @param {Client} client
 */

export async function usersHandler(client: Client) {
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

