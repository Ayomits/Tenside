const {ButtonInteraction} = require('discord.js')

module.exports = {
  customId: "closeAnketa",

  /** 
   * @param {ButtonInteraction} interaction
  */

  async execute(interaction) {
    if (interaction.message.author.id != interaction.user.id) {
      return await interaction.message.delete()
    }return
  }
}