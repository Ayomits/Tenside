import {ButtonInteraction, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, Interaction} from 'discord.js'
import { Button } from '../../../types'

const button: Button = {
  customId: "themeDelete",

  /**
   * @param {ButtonInteraction} interaction
   */

  async execute(interaction: ButtonInteraction) {
    const modal = new ModalBuilder()
                  .setCustomId("themeDeleteModal")
                  .setTitle("Удаление темы")
    
    const themeId: any = new ActionRowBuilder().addComponents(
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

export default button