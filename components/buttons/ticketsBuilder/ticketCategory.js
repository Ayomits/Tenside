const {ButtonInteraction, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle} = require("discord.js")
const {TicketCategory} = require("../../../models/tickets")


module.exports = {
  customId: "ticketCategory",

  /**
   *@param {ButtonInteraction} interaction
   */

   async execute(interaction) {
    const modal = new ModalBuilder()
                  .setCustomId("ticketCategoryModal")
                  .setTitle("Категория тикетов")
    
    const category_id = new TextInputBuilder()
                        .setCustomId("categoryId")
                        .setLabel("Айди категории")
                        .setPlaceholder("укажите айди категории!!")
                        .setStyle(TextInputStyle.Short)
    
    const categoryIdComponent = new ActionRowBuilder().addComponents(category_id)

    modal.addComponents(categoryIdComponent)

    await interaction.showModal(modal)
   } 
}