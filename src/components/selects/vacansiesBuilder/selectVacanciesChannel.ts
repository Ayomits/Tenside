
import { systemMessageModel } from "../../../models/system_message"
import {setChannel} from '../../../functions/setChannel'
import { Button } from "../../../types";
import { ChannelSelectMenuInteraction } from "discord.js"

const button: Button = {
  customId: "selectVacanciesChannel",

  /**
   * @param { ChannelSelectMenuInteraction } interaction
   */

  async execute(interaction: ChannelSelectMenuInteraction) {
    await setChannel(interaction, systemMessageModel, "вакансий")
  }
};

export default button