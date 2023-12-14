import { Client, ChannelType, GuildChannel, Guild } from "discord.js"
import { userModel } from "../../models/users"

/**
 *
 * @param {Client} client
 */

export const checkUsersInVoice = async (client: Client) => {
  console.log("Занесение пользователей в войсах начато....");
  let start = Date.now();
  const guilds = client.guilds.cache;

  guilds.forEach((guild: Guild) => {
    guild.channels.cache.forEach((channel) => {
      if (channel.isVoiceBased()) {
        const members = channel.members.forEach(async (member) => {
          client.voiceUsers.set(member.user?.id, setInterval(async () => {
            await userModel.updateOne({guild_id: channel.guildId, user_id: member.user?.id}, {$inc: {balance: 5, voiceActive: 60}})
          }, 60_000))
        })
      }
    })
  });
  let end = (Date.now() - start) / 1000
  console.log('[CheckUsersInVoice.js] занесение в коллекцию завершено. Время выполнения: ' + end + 'с');
};
