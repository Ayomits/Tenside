const {
  ButtonInteraction,
  TextInputBuilder,
  ActionRowBuilder,
  TextInputStyle,
} = require("discord.js");
const { ModalBuilder } = require("discord.js");

module.exports = {
  customId: "createAnketa",

  /**
   * @param {ButtonInteraction} interaction
   */

  async execute(interaction) {
    if (interaction.message.author.id != interaction.user.id) {
      const modal = new ModalBuilder()
        .setCustomId("questionBuilder")
        .setTitle("Анкеты");

      const question = new TextInputBuilder()
        .setCustomId("questionValue")
        .setLabel("Ваш вопрос")
        .setMaxLength(40)
        .setRequired(true)
        .setPlaceholder("Введите ваш вопрос")
        .setStyle(TextInputStyle.Short);

      const questionType = new TextInputBuilder()
        .setCustomId("questionType")
        .setLabel("Категория вопроса")
        .setMaxLength(40)
        .setRequired(true)
        .setPlaceholder("Helper, Control и т.п.")
        .setStyle(TextInputStyle.Short);

      const questionRow = new ActionRowBuilder().addComponents(question);
      const questionTypeRow = new ActionRowBuilder().addComponents(
        questionType
      );

      modal.addComponents(questionRow, questionTypeRow);
      await interaction.showModal(modal);
    } else return;
  },
};
