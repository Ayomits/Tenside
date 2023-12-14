import {ButtonInteraction, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle} from "discord.js"


module.exports = {
  customId: "themeCreateButton",

  /**
   *@param {ButtonInteraction} interaction
   */

   async execute(interaction: ButtonInteraction) {
    const modal = new ModalBuilder()
                  .setTitle("Создание темы")
                  .setCustomId("themeCreateModal")
    

    const themeTitle = new ActionRowBuilder().addComponents(
      new TextInputBuilder()
          .setLabel("Название темы")
          .setCustomId("themeTitle")
          .setPlaceholder("Жалоба на юзера")
          .setRequired(true)
          .setStyle(TextInputStyle.Short)
    )
    const themeDesc = new ActionRowBuilder().addComponents(
      new TextInputBuilder()
          .setLabel("Описание темы")
          .setCustomId("themeDesc")
          .setPlaceholder("Отправьте жалобу и ...")
          .setRequired(true)
          .setStyle(TextInputStyle.Paragraph)
    )
    const themeId = new ActionRowBuilder().addComponents(
      new TextInputBuilder()
          .setLabel("ID темы")
          .setCustomId("themeId")
          .setPlaceholder("report")
          .setRequired(true)
          .setStyle(TextInputStyle.Short)
    )
    const themePingedRoles: any = new ActionRowBuilder().addComponents(
      new TextInputBuilder()
          .setCustomId("pingedRoles")
          .setLabel("Пингуемые роли на тему")
          .setRequired(true)
          .setPlaceholder("айди ролей через пробел!!")
          .setStyle(TextInputStyle.Short)
    )

    modal.addComponents(themeTitle, themeDesc, themePingedRoles, themeId)

    await interaction.showModal(modal)
   }
}