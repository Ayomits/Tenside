const {ModalSubmitInteraction, EmbedBuilder} = require('discord.js')
const { systemMessageModel } = require('../../models/system_message/models')

module.exports = {
  customId: 'embedGenerator',

  /**
   * @param {ModalSubmitInteraction} interaction
   */

  async execute(interaction) {
    const embedTitle = interaction.fields.getTextInputValue("embedTitle")
    const embedDescription = interaction.fields.getTextInputValue('embedDescription')
    const embedImage = interaction.fields.getTextInputValue('embedImage')
    const embedColor = interaction.fields.getTextInputValue('embedColor')

    const embed = new EmbedBuilder()
                  .setTitle(embedTitle)
                  .setDescription(embedDescription)
                  .setImage(embedImage)
                  .setColor(embedColor)

    const channel = systemMessageModel.findall()
  }
}