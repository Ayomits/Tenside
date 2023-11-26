const {
  ButtonInteraction,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} = require("discord.js");

module.exports = {
  customId: "vacansiesEmbedBuilder",

  /**
   * @param {ButtonInteraction} interaction
   */

  async execute(interaction) {
    const modal = new ModalBuilder()
      .setTitle("Генератор эмбеда")
      .setCustomId("embedGenerator");

    const title = new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId("embedTitle")
        .setLabel("Название эмбеда вакансий")
        .setPlaceholder("Название эмбеда")
        .setRequired(true)
        .setStyle(TextInputStyle.Short),
    );
    const desc =  new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId("embedDescription")
        .setLabel("Описание эмбеда")
        .setPlaceholder("Бла-бла")
        .setStyle(TextInputStyle.Short)
        .setRequired(true),
    )
    const color =  new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId("embedColor")
        .setLabel("цвет эмбеда")
        .setPlaceholder("#0000000")
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
        .setMaxLength(7)
        .setMinLength(7),
    )
    const image = new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId("embedImage")
        .setLabel("Цвет эмбеда")
        .setPlaceholder("https://example.com")
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
    )
    
    modal.setComponents(title, desc, color, image)

    await interaction.showModal(modal);
  },
};
