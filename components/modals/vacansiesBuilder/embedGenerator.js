const {embedBuilderModalCallback} = require("../../../functions/embedGen")
const {systemAnketaEmbed} = require("../../../models/system_message/models")
const {ModalSubmitInteraction} = require("discord.js")

module.exports = {
  customId: 'embedGenerator',

  /**
   * @param {ModalSubmitInteraction} interaction
   */

  async execute(interaction) {
    await embedBuilderModalCallback(interaction, systemAnketaEmbed)
  }
}