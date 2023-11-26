const {ButtonInteraction, ModalBuilder, ActionRow, TextInputBuilder, TextInputStyle} = require('discord.js')
const {systemMessageModel} = require('../../models/models')


module.exports = {
  customId: "vacansiesEmbedBuilder",

  /**
   * @param {ButtonInteraction} interaction
   */

  async execute(interaction) {
    const modal = new ModalBuilder()
                  .setTitle("Генератор эмбеда")
                  .setCustomId("embedGenerator")
                  .setComponents(
                    new TextInputBuilder()
                        .setCustomId("embedTitle")
                        .setLabel("Название эмбеда вакансий")
                        .setRequired(true)
                        .setStyle(TextInputStyle.Short),

                    new TextInputBuilder()
                        .setCustomId("embedDescription")
                        .setLabel('Описание эмбеда вакансий')
                        .setPlaceholder("Бла-бла")
                        .setStyle(TextInputStyle.Paragraph),
                    
                    new TextInputBuilder()
                        .setCustomId("embedImage")
                        .setLabel("Ссылка на картинку")
                        .setPlaceholder("https://example.com")
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true),

                    new TextInputBuilder()
                        .setCustomId("embedColor")
                        .setLabel('Цвет эмбеда в hex')
                        .setMaxLength(7)
                        .setMinLength(7)
                        .setRequired(true)
                        .setStyle(TextInputStyle.Short)
                  )
    await interaction.showModal(modal)
  }
} 