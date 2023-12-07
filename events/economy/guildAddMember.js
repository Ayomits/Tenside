const { Events, GuildMember  } = require("discord.js");
const {userModel} = require('../../models/users')

module.exports = {
  name: Events.GuildMemberAdd,
  once: false,

  /**
   * @param {GuildMember} member
   */

  async execute (member) {
    if (!member.user.bot) {
      const user = await userModel.findOne({guild_id: member.guild.id, user_id: member.user.id})
      if (!user) {
        await userModel.create({guild_id: member.guild.id, user_id: member.user.id})
      }
    }
  }
}