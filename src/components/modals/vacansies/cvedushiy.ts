import { Button } from "../../../types";

import { ModalSubmitInteraction, EmbedBuilder } from 'discord.js'
import {baseCallback} from "../../../functions/baseExecute"

const button: Button = {
  customId: 'closer',

  /**
   * @param {ModalSubmitInteraction} interaction
   */
  async execute(interaction: ModalSubmitInteraction) {
    await baseCallback(interaction)
  },
};

export default button