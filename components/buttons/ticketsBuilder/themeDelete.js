const {ButtonInteraction, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle} = require('discord.js')

module.exports = {
  customId: "themeDelete",

  /**
   * @param {ButtonInteraction} interaction
   */

  async execute(interaction) {
    const modal = new ModalBuilder()
                  .setCustomId("themeDeleteModal")
                  .setTitle("Удаление темы")
    
    const themeId = new ActionRowBuilder().addComponents(
      new TextInputBuilder()
          .setLabel("Введите айди темы")
          .setCustomId("themeId")
          .setPlaceholder("REPORT")
          .setStyle(TextInputStyle.Short)
    )
    modal.addComponents(themeId)

    await interaction.showModal(modal)
  }
}