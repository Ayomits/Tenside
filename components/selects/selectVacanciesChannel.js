const { ChannelSelectMenuInteraction } = require("discord.js");
const { systemMessageModel, systemAnketa } = require("../../models/system_message/models");
const {EmbedBuilder} = require('discord.js')
const sequelize = require('../../db')


module.exports = {
  customId: "selectVacanciesChannel",

  /**
   * @param { ChannelSelectMenuInteraction } interaction
   */

  async execute(interaction) {
    const values = interaction.values[0];
    const embed = new EmbedBuilder()
      .setTitle("Установка канала для отправки вакансий")
      .setTimestamp(Date.now())
      .setFooter({
        iconURL: interaction.user.displayAvatarURL(),
        text: interaction.user.username,
      });
      
    const [UpdatedRows] = await systemMessageModel.update({channel_id: interaction.values[0]}, {where: {guild_id: interaction.guildId}})
    
    if (UpdatedRows > 0) {
      embed.setDescription(`Ваш канал: <#${values}>`)
    }else {
      await systemMessageModel.create({guild_id: interaction.guildId, channel_id: values}).then((result) => {
        embed.setDescription(`Ваш канал: <#${result.channel_id}>`)
      })
    }
    return await interaction.message.edit({embeds: [embed]})
  },
};
