import {ChannelSelectMenuInteraction, EmbedBuilder} from "discord.js"
import {TicketSettings} from "../../../models/tickets"
import { setChannel } from "../../../functions/setChannel"
import { Button } from "../../../types"

const button: Button =  {
  customId: "setChannelSelect",

  /**
   * @param {ChannelSelectMenuInteraction} interaction
   */

  async execute(interaction: ChannelSelectMenuInteraction) {
    await setChannel(interaction, TicketSettings, "тикетов")
  }
}

export default button