const {ButtonInteraction} = require('discord.js')

module.exports = {
  customId: "helloWorld1",
  
  /**
   * @param {ButtonInteraction} interaction
   */

  async execute(interaction) {
    return await interaction.reply("кнопка была нажата")
  }
}