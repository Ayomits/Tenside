const { ModalSubmitInteraction, EmbedBuilder } = require('discord.js');
const {baseCallback} = require("./baseExecute")

module.exports = {
  customId: 'vedushiy',

  /**
   * @param {ModalSubmitInteraction} interaction
   */
  async execute(interaction) {
    await baseCallback(interaction)
  },
};
