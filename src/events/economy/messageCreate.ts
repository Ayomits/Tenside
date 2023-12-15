import { Events, Message  } from  "discord.js"
import {userModel} from '../../models/users'
import { BotEvent } from "../../types"

/**
 * @param {Message} message
 */

const onMessage: BotEvent = {
  name: Events.MessageCreate,
  once: false,

  /**
   * 
   * @param {Message} message 
   */

  async execute(message: Message) {
    if (!message.author.bot) {
      if (!message.content.startsWith(process.env.PREFIX || '.')){
        await userModel.updateOne({user_id: message.author.id, guild_id: message.guild?.id}, {$inc: {balance: 2, messageCount: 1}})
      }
    }
  }
}
export default onMessage