import {embedBuilderModalCallback} from "../../../functions/embedGen"
import {TicketSettingsEmbed} from "../../../models/tickets"
import {ModalSubmitInteraction} from 'discord.js'
import { Button } from "../../../types"

const button: Button = {
  customId: 'embedTicketBuilderModal',

  /**
   * @param {ModalSubmitInteraction} interaction
   */

  async execute(interaction) {
    await embedBuilderModalCallback(interaction, TicketSettingsEmbed)
  }
}

export default button