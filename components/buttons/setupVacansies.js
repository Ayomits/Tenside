const { ModalBuilder, ButtonInteraction, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require("discord.js")

module.exports = {
  customId: 'setupVacansies',

  /** 
   * @param {ButtonInteraction} interaction
  */

  async execute(interaction) {
    const modal = new ModalBuilder()
      .setTitle("Вопросы к вакансиям")
      .setCustomId("questions")

    const question1 = new ActionRowBuilder().addComponents(
      new TextInputBuilder()
          .setLabel("Вопрос 1")
          .setCustomId('question1')
          .setRequired(true)
          .setPlaceholder("Какое мороженое ешь?")
          .setStyle(TextInputStyle.Short)
      )
    const question2 = new ActionRowBuilder().addComponents(
      new TextInputBuilder()
          .setLabel("Вопрос2")
          .setCustomId('question2')
          .setRequired(true)
          .setPlaceholder("Какое мороженое ешь?")
          .setStyle(TextInputStyle.Short)
    )
    const type = new ActionRowBuilder().addComponents(
      new TextInputBuilder()
          .setLabel("Категория")
          .setCustomId('type')
          .setRequired(true)
          .setPlaceholder("Helper, closer...")
          .setStyle(TextInputStyle.Short)
    )
    modal.addComponents(question1, question2, type)     

    await interaction.showModal(modal)
  }
}