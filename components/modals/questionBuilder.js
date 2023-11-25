const {ModalSubmitInteraction} = require("discord.js")
const sequelize = require("../../db")
const systemAnketa = require("../../models/system_message/models")

module.exports = {
  customId: 'questionBuilder',
  /**
   * @param {ModalSubmitInteraction} interaction
   */


  async execute(interaction) {
    const questionValue = interaction.fields.getTextInputValue("questionValue")
    const questionType = interaction.fields.getTextInputValue("questionType")
    await interaction.reply({content: questionType + " " + questionValue})
  }
}