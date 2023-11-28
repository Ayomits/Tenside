const {embedBuilderModal} = require("../../../functions/embedGen")

module.exports = {
  customId: "vacansiesEmbedBuilder",

  /**
   * @param {ButtonInteraction} interaction
   */

  async execute(interaction) {
    await embedBuilderModal(interaction)
  },
};
