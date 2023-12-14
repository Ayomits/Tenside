import {ButtonInteraction, EmbedBuilder} from 'discord.js'
import {systemMessageModel} from '../../../models/system_message'
import { Button } from '../../../types'

const button: Button = {
  customId: "deleteExists",

  /** 
   * @param {ButtonInteraction} interaction
  */

  async execute(interaction: ButtonInteraction) {
    const embed = new EmbedBuilder()
                  .setTitle("Установка канала для отправки вакансий")
                  .setTimestamp(Date.now())
                  .setFooter({iconURL: interaction.user.displayAvatarURL(), text: interaction.user.username})
    const channel_id = await systemMessageModel.findOneAndDelete({
      where: {
        guild_id: interaction.guildId
      }
    })
    await interaction.message.edit({embeds: [embed.setDescription(`Ваш канал: отсутствует`)]})
  }
}

export default button