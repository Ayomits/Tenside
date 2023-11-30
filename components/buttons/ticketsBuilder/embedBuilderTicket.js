const {embedBuilderModal} = require("../../../functions/embedGen")

module.exports = {
  customId: "embedBuilderTicket",

  /**
   * @param {ButtonInteraction} interaction
   */

  async execute(interaction) {
    await embedBuilderModal(interaction, "embedTicketBuilderModal")
  },
};
