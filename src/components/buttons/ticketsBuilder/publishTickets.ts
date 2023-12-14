import {StringSelectMenuInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, GuildChannel} from 'discord.js'
import {TicketSettings, TicketSettingsEmbed, TicketLogSettings} from "../../../models/tickets"
import { Button } from '../../../types'


const button: Button =  {
  customId: "publishTickets",

  /**
   * @param {StringSelectMenuInteraction} interaction
   */

  async execute(interaction: StringSelectMenuInteraction) {
    let channelId: string
    await TicketSettings.findOne({guild_id: interaction.guildId}).then((result: any) => {
      channelId = result.channel_id
    }).catch(() => {
      console.log(channelId);
      interaction.reply({content: "что-то пошло не так... Не указан канал публикации", ephemeral:true})
    })
    await TicketLogSettings.findOne({guild_id: interaction.guildId}).then(async () => {
      await TicketSettingsEmbed.findOne({guild_id: interaction.guildId}).then(async (fields: any) =>  {
        const channel: any = interaction.client.channels.cache.get(channelId)
        const embed = new EmbedBuilder()
                      .setTitle(fields.title)
                      .setDescription(fields.description)
                      .setTimestamp(Date.now())
        
        const ticketCreate = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
              .setCustomId("ticketCreate")
              .setLabel("Создать тикет")
              .setStyle(ButtonStyle.Success)
        )
        await channel.send({embeds: [embed], components: [ticketCreate]})
        await interaction.reply({content: "всё успешно отправлено", ephemeral: true})
      })
      
    }).catch((err) =>  {
      console.log(err);
      interaction.reply({content: "Вы что-то забыли\n" + err, ephemeral: true})
    })

  }
}

export default button