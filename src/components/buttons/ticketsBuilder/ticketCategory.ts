import {ButtonInteraction, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle} from "discord.js"
import {TicketCategory} from "../../../models/tickets"
import { Button } from "../../../types"


const button: Button = {
  customId: "ticketCategory",

  /**
   *@param {ButtonInteraction} interaction
   */

   async execute(interaction: ButtonInteraction) {
    const modal = new ModalBuilder()
                  .setCustomId("ticketCategoryModal")
                  .setTitle("Категория тикетов")
    
    const category_id = new TextInputBuilder()
                        .setCustomId("categoryId")
                        .setLabel("Айди категории")
                        .setPlaceholder("укажите айди категории!!")
                        .setStyle(TextInputStyle.Short)
    
    const categoryIdComponent: any = new ActionRowBuilder().addComponents(category_id)

    modal.addComponents(categoryIdComponent)

    await interaction.showModal(modal)
   } 
}

export default button