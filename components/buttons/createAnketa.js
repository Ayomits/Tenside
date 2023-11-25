const {ButtonInteraction} = require('discord.js')
const {ModalBuilder} = require('discord.js')


module.exports = {
  customId: "createAnketa",
  
  /**
   * @param {ButtonInteraction} interaction
   */

  async execute(interaction) {
    const modal = new ModalBuilder()
                  .setCustomId("questionAdd")
                  .setTitle("Напиши ваш вопрос")
  }
}