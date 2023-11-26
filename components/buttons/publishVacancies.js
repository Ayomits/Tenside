const {ButtonInteraction, EmbedBuilder} = require('discord.js')
const {systemMessageModel} = require('../../models/models')

module.exports = {
  customId: "publishVacancies",

  /** 
   * @param {ButtonInteraction} interaction
  */

  async execute(interaction) {
    const embed = new EmbedBuilder()
                  .setTitle("Установка канала для отправки вакансий")
                  .setTimestamp(Date.now())
                  .setFooter({iconURL: interaction.user.displayAvatarURL(), text: interaction.user.username})
    const channel_id = await systemMessageModel.findAll({
      where: {
        guild_id: interaction.guildId
      }
    })
    if (channel_id) {
      const channel = interaction.client.channels.cache.get(String(channel_id))
      if (channel) {
        return await channel.send({content: "hello world"})
      } else {
        return await channel.send({content: "канала не существует"})
      }
    }else {
      await interaction.reply({content: "у вас ещё нет канала", ephemeral: true})
    }
  }
}