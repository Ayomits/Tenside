const {ButtonInteraction} = require('discord.js')

module.exports = {
  customId: "firstBtn",
  
  /**
   * @param {ButtonInteraction} interaction
   */

  async execute(interaction) {
    return await interaction.reply("кнопка была нажата")
  }
}