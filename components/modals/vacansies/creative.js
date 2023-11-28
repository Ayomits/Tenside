const { ModalSubmitInteraction, EmbedBuilder } = require('discord.js');
const {baseCallback} = require("../vacansiesBuilder/baseExecute")

module.exports = {
  customId: 'creative',

  /**
   * @param {ModalSubmitInteraction} interaction
   */
  async execute(interaction) {
    await baseCallback(interaction)
  },
};
