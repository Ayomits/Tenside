import { Button } from "../../../types";
import {
  ButtonInteraction, ChannelSelectMenuInteraction,
} from "discord.js"
import {
  systemAnketaRecrutChannel
} from "../../../models/system_message"
import {setChannel} from "../../../functions/setChannel"



const button: Button = {
  customId: "setRecrutChannel",

  /**
   * @param {ChannelSelectMenuInteraction} interaction
   */

  async execute(interaction: ChannelSelectMenuInteraction) {
    await setChannel (interaction, systemAnketaRecrutChannel, "вакансий")
  }
}

export default button