const {ChannelSelectMenuInteraction, EmbedBuilder} = require("discord.js")
const {ticketSettings} = require("../../../models/tickets/models")

module.exports = {
  customId: "setChannelSelect",

  /**
   * @param {ChannelSelectMenuInteraction} interaction
   */

  async execute(interaction) {
    const values = interaction.values[0]
    const [UpdatedRows] = await ticketSettings.update({channel_id: values}, {where: {guild_id: interaction.guildId}})

    let embed = new EmbedBuilder()
                .setTitle("Настройка тикетов")
                .setFooter({iconURL: interaction.user.displayAvatarURL(), text: interaction.user.username})
                .setColor("#2F3136")
    

    if (UpdatedRows > 0) {
      embed.setDescription(`Ваш канал <#${values}>`)
      await interaction.message.edit({embeds: [embed]})
      await interaction.reply({content: "канал для тикетов успешно обновлен в базе данных", ephemeral: true})
    } else {
      await ticketSettings.create({guild_id: interaction.guildId, channel_id: values})
      embed.setDescription(`Ваш канал <#${values}>`)
      await interaction.message.edit({embeds: [embed]})
      await interaction.reply({content: "канал для тикетов успешно создан в базе данных", ephemeral: true})
    }
  }
}