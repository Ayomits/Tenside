import {ModalSubmitInteraction}  from "discord.js"
import {TicketSettingsTheme} from '../../../models/tickets'
import { Button } from "../../../types"


const button: Button = {
  customId: "themeCreateModal",

  /**
   *@param {ModalSubmitInteraction} interaction
   */
  
   async execute(interaction: ModalSubmitInteraction) {
    const themeTitle = interaction.fields.getField('themeTitle').value
    const themeDesc = interaction.fields.getField('themeDesc').value
    const themeId = interaction.fields.getField("themeId").value
    const pingedRoles = interaction.fields.getField('pingedRoles').value

    await TicketSettingsTheme.findOne({theme_uniq_id: themeId}).then(async (result) => {
      if (result !== null) {
        await interaction.reply({content: `Тема с такими id уже существует. Удалить можно при помощи кнопки "удалить тему" `, ephemeral: true})
      }else {
        await TicketSettingsTheme.create({guild_id: interaction.guildId, theme_title: themeTitle, theme_desc: themeDesc, theme_uniq_id: themeId.toLowerCase(), pinged_roles: pingedRoles})
        await interaction.reply({content: "Тема успешно создана", ephemeral: true})
      }
    }).catch((err) => {
      interaction.reply({content: `Случилась ошибка \n ${err}`, ephemeral: true})
    })
   }
}

export default button