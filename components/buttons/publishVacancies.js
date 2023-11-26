const {ButtonInteraction, EmbedBuilder} = require('discord.js')
const {systemMessageModel, systemAnketaEmbed} = require('../../models/system_message/models')

module.exports = {
  customId: "publishVacancies",

  /** 
   * @param {ButtonInteraction} interaction
  */

  async execute(interaction) {
    const channel_id = await systemMessageModel.findOne({
      where: {
        guild_id: interaction.guildId
      }
    })
    if (channel_id) {
      const channelId = channel_id.dataValues.channel_id
      const channel = interaction.guild.channels.cache.get(channelId);
      if (channel) {
        const fields = await systemAnketaEmbed.findOne({where: {guild_id: interaction.guildId}})
        if (fields) {
          const fields_ = fields.dataValues
          const embed = new EmbedBuilder()
                        .setTitle(fields_.title)
                        .setDescription(fields_.description)
                        .setColor(fields_.color)
                        .setImage(fields_.imageLink)
          
          await interaction.message.delete()
          return await channel.send({embeds: [embed]})

      }else await interaction.reply({content: "эмбед не создан, создайте его при помощи кнопки", ephemeral: true})
      } else {
        return await channel.send({content: "канала не существует"})
      }
    }else {
      await interaction.reply({content: "у вас ещё нет канала", ephemeral: true})
    }
  }
}