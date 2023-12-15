import { Events, GuildMember  } from "discord.js"
import {userModel} from '../../models/users'

const guildAddMember = {
  name: Events.GuildMemberAdd,
  once: false,

  /**
   * @param {GuildMember} member
   */

  async execute (member: GuildMember) {
    if (!member.user.bot) {
      const user = await userModel.findOne({guild_id: member.guild?.id, user_id: member.user?.id})
      if (!user) {
        await userModel.create({guild_id: member.guild?.id, user_id: member.user?.id})
      }
    }
  }
}
export default guildAddMember