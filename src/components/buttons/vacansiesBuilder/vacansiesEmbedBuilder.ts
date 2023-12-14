import { Button } from "../../../types";

import { ButtonInteraction } from "discord.js";

import {embedBuilderModal} from "../../../functions/embedGen"

const button: Button = {
  customId: "vacansiesEmbedBuilder",

  /**
   * @param {ButtonInteraction} interaction
   */

  async execute(interaction: ButtonInteraction) {
    await embedBuilderModal(interaction, "embedGenerator")
  },
};
