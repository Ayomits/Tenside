const {TextInputBuilder, ModalBuilder, TextInputStyle} = require("discord.js")

async function embedBuilderModal (interaction) {
  new ModalBuilder()
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
        .setStyle(TextInputStyle.Paragraph)
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
        .setRequired(false)
    )
    
    modal.setComponents(title, desc, color, image)

    await interaction.showModal(modal);
}

async function embedBuilderModalCallback (interaction, model) {
    const embedTitle = interaction.fields.getTextInputValue("embedTitle")
    const embedDescription = interaction.fields.getTextInputValue('embedDescription')
    const embedImage = interaction.fields.getTextInputValue('embedImage')
    const embedColor = interaction.fields.getTextInputValue('embedColor')


    await model.create({
      guild_id: interaction.guildId,
      title: embedTitle,
      description: embedDescription,
      color: embedColor,
      imageLink: embedImage ? embedImage != null : "https://media.discordapp.net/attachments/1166714499693281400/1178218736470200330/image.png?format=webp&width=1340&height=502"
    }).then(async () => {
      await interaction.reply({content: "успешно создан эмбед", ephemeral: true})
    }).catch(async () => {
      await model.update({
        title: embedTitle,
        description: embedDescription,
        color: embedColor,
        imageLink: embedImage ? embedImage != null : "https://media.discordapp.net/attachments/1166714499693281400/1178218736470200330/image.png?format=webp&width=1340&height=502"
      }, {where: {guild_id: interaction.guildId}})
      await interaction.reply({content: "успешно обновлён эмбед"})
    })
}

module.exports = {
  embedBuilderModal,
  embedBuilderModalCallback,
}