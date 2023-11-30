const {StringSelectMenuInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js")
const {TicketSettings, TicketSettingsEmbed, TicketLogSettings} = require("../../../models/tickets")


module.exports = {
  customId: "publishTickets",

  /**
   * @param {StringSelectMenuInteraction} interaction
   */

  async execute(interaction) {
    let channelId
    await TicketSettings.findOne({guild_id: interaction.guildId}).then((result) => {
      channelId = result.channel_id
    }).catch(() => {
      console.log(channelId);
      interaction.reply({content: "что-то пошло не так... Не указан канал публикации", ephemeral:true})
    })
    await TicketLogSettings.findOne({guild_id: interaction.guildId}).then(async () => {
      await TicketSettingsEmbed.findOne({guild_id: interaction.guildId}).then(async (fields) =>  {
        const channel = interaction.client.channels.cache.get(channelId)
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