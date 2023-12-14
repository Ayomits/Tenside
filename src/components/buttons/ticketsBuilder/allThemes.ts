import {ButtonInteraction, EmbedBuilder} from "discord.js"
import { TicketSettingsTheme } from "../../../models/tickets"
import { Button } from "../../../types"

const button: Button =  {
  customId: "allThemes",

  /**
   * @param {ButtonInteraction} interaction
   */

  async execute(interaction: ButtonInteraction) {
    const embed = new EmbedBuilder()
                  .setTitle("Все темы тикетов")

    let description: string = ""

    const values = await TicketSettingsTheme.find({guild_id: interaction.guildId})
    for (const val of values) {
      description += `**Тема**: ${val.theme_uniq_id}\n **Название темы**: ${val.theme_title}\n **Описание темы**: ${val.theme_desc} \n **Уникальный id**: ${val.theme_uniq_id}\n **Пингуемые роли на тему**: ${val.pinged_roles}\n\n`
    }
    embed.setDescription(description)
    await interaction.reply({embeds: [embed], ephemeral: true})
  }
}

export default button