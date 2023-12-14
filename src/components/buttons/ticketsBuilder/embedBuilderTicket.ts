import { ButtonInteraction } from "discord.js";

import {Button} from '../../../types'

import {embedBuilderModal} from "../../../functions/embedGen"



const button: Button = {
  customId: "embedBuilderTicket",

  /**
   * @param {ButtonInteraction} interaction
   */

  async execute(interaction: ButtonInteraction) {
    await embedBuilderModal(interaction, "embedTicketBuilderModal")
  },
};

export default button