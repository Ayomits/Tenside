const { SlashCommandBuilder } = require("@discordjs/builders");
const {CommandInteraction, ButtonBuilder, ButtonStyle, EmbedBuilder, ComponentType, ActionRowBuilder} = require('discord.js')
const {CurrentTicket} = require("../../models/tickets")

module.exports = {
  data: new SlashCommandBuilder()
        .setName("ticket-control")
        .setDescription("Управление тикетами"),

  /**
   * @param {CommandInteraction} interaction
   */

  async execute(interaction) {
    const ticket = CurrentTicket.findOne({guild_id: interaction.guildId, channel_id: interaction.channelId})
    if (ticket !== null) {
      const closeTicket = new ButtonBuilder()
                          .setCustomId("closeTicket")
                          .setLabel("Закрыть тикет")
                          .setStyle(ButtonStyle.Danger)
      const changeAnswer = new ButtonBuilder()
                            .setCustomId("changeAnswer")
                            .setLabel("Передать тикет")
                            .setStyle(ButtonStyle.Success)

      const AcceptTiket = new ButtonBuilder()
                          .setCustomId("acceptBtn")
                          .setLabel("Принять тикет")
                          .setStyle(ButtonStyle.Success)
            

      const embed = new EmbedBuilder()
                    .setTitle("Управлением тикетом")
                    .setDescription("Выберите действие")
      


      await interaction.reply({embeds: [embed], components: [new ActionRowBuilder().addComponents(changeAnswer, closeTicket)]})

      const changeAnswerEmbed = new EmbedBuilder()
                                .setTitle("Смена отвечающуего")
                                .setDescription("принять тикет")

      interaction.channel.createMessageComponentCollector({
        componentType: ComponentType.Button
      }).on("collect", async (inter) => {
        if (inter.customId === 'changeAnswer') {
          if (inter.user.id === interaction.user.id)
           {
            await inter.channel.permissionOverwrites.edit(inter.user, {
              SendMessages: false
            })
            await inter.reply({content: "ждёмс)) Вы свободны", ephemeral: true})
            await inter.message.edit({embeds: [changeAnswerEmbed], components: [new ActionRowBuilder().addComponents(AcceptTiket)]})
          }
        }
        if (inter.customId === "acceptBtn") {
          if (inter.user.id === interaction.user.id)
          {
              await inter.reply({content: "вы успешно приняли тикет", ephemeral: true})
              await inter.message.edit({embeds: [changeAnswerEmbed.setDescription("Найден отвечающий..")], components: []})
              await inter.channel.permissionOverwrites.edit(inter.user, {
                SendMessages:true
              })
            }
        }
        if (inter.customId === "closeTicket") {
          if(inter.user.id == interaction.user.id) {
            await CurrentTicket.deleteOne({guild_id: inter.guildId, channel_id: inter.channel.id})
            await inter.channel.delete()
          }
        }
      })
    }
  }
}