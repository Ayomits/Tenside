import { Button } from "../../../types"

import {ModalSubmitInteraction} from 'discord.js'
import {TicketSettingsTheme} from '../../../models/tickets'


const button: Button = {
  customId: "themeDeleteModal",

  /**
   *@param {ModalSubmitInteraction} interaction
   */
  
   async execute(interaction: ModalSubmitInteraction) {
    const themeId = interaction.fields?.getField('themeId').value

    await TicketSettingsTheme.findOne({theme_uniq_id: themeId.toLowerCase(), guild_id: interaction.guildId}).then(async (result) => {
      if (result === null) {
        await interaction.reply({content: "Тема с этим id ещё не создана", ephemeral: true})
      }else {
        await TicketSettingsTheme.deleteOne({theme_uniq_id: themeId.toLowerCase(), guild_id: interaction.guildId})
        await interaction.reply({content: `Тема с id - ${themeId.toLowerCase()} успешно удалена`, ephemeral: true})
      }
    })
   }
}
export default button