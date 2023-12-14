import {ChannelSelectMenuInteraction} from "discord.js"
import {TicketLogSettings} from "../../../models/tickets"
import { setChannel } from "../../../functions/setChannel"
import { Button } from "../../../types"

const button: Button = {
  customId: "setChannelTicketLogs",

  /**
   * @param {ChannelSelectMenuInteraction} interaction
   */

  async execute(interaction: ChannelSelectMenuInteraction) {
    await setChannel(interaction, TicketLogSettings, "тикет-логов")
  }
}

export default button