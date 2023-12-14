import { Button } from "../../../types"

import {embedBuilderModalCallback} from "../../../functions/embedGen"
import {systemAnketaEmbed}  from "../../../models/system_message"
import {ModalSubmitInteraction} from "discord.js"

const button: Button = {
  customId: 'embedGenerator',

  /**
   * @param {ModalSubmitInteraction} interaction
   */

  async execute(interaction) {
    await embedBuilderModalCallback(interaction, systemAnketaEmbed)
  }
}
export default button