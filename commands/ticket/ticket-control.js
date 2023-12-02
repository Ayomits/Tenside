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
                          .setCustomId("closeTicket_")
                          .setLabel("Закрыть тикет")
                          .setStyle(ButtonStyle.Danger)
      const changeAnswer = new ButtonBuilder()
                            .setCustomId("changeAnswer")
                            .setLabel("Передать тикет")
                            .setStyle(ButtonStyle.Success)

      const AcceptTiket = new ButtonBuilder()
                          .setCustomId("acceptTicketBtn")
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
            await inter.message.edit({embeds: [changeAnswerEmbed], components: [new ActionRowBuilder().addComponents(AcceptTiket)]})
          }
        }
        if (inter.customId === "acceptTicketBtn") {
          console.log(inter.user.id, interaction.user.id);
          if (inter.user.id === interaction.user.id)
          { 
              await inter.message.edit({embeds: [changeAnswerEmbed.setDescription("Найден отвечающий..")], components: []})
              await inter.channel.permissionOverwrites.edit(inter.user, {
                SendMessages:true
              })
            }
        }
        if (inter.customId === "closeTicket_") {
          if(inter.user.id == interaction.user.id) {
            await CurrentTicket.findOneAndDelete({guild_id: inter.guildId, channel_id: inter.channelId})
            await inter.channel.delete()
          }
        }
      })
    }
  }
}