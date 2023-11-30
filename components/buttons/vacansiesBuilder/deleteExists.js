const {ButtonInteraction, EmbedBuilder} = require('discord.js')
const {systemMessageModel} = require('../../../models/system_message')

module.exports = {
  customId: "deleteExists",

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
    if (channel_id.length > 0) {
      await channel_id[0].destroy();
      await interaction.message.edit({embeds: [embed.setDescription(`Ваш канал: отсутствует`)]})
    }else {
      await interaction.reply({content: "у вас ещё нет канала", ephemeral: true})
    }
  }
}