const { SlashCommandBuilder } = require("@discordjs/builders");
const {CommandInteraction, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, RoleSelectMenuBuilder, ChannelSelectMenuBuilder, TextChannel, ChannelType} = require('discord.js')
const { systemMessageModel, systemAnketa } = require("../../models/models");

module.exports = {
  data: new SlashCommandBuilder()
        .setName("setupmodal")
        .setDescription("установка канала для публикации вакансий"),
  
  /**
   * @param {CommandInteraction} interaction
   */

  async execute(interaction) {
    let channelId
    await systemMessageModel.findAll({
      where: {
        guild_id: interaction.guildId
      }
    }).then((result) => {
      channelId = result[0].dataValues.channel_id
    }).catch(() => {
      channelId = "отсутствует"
    })
    const embed = new EmbedBuilder()
                  .setTitle("Установка канала для отправки вакансий")
                  .setTimestamp(Date.now())
                  .setFooter({iconURL: interaction.user.displayAvatarURL(), text: interaction.user.username})
    
    if (channelId === "отсутствует") {
      embed.setDescription(`Ваш канал: ${channelId}`)
    }else {
      const channel = interaction.client.channels.cache.get(String(channelId))
      embed.setDescription(`Ваш канал: ${channel}`)
    }

    const select = new ActionRowBuilder().addComponents(
                new ChannelSelectMenuBuilder()
                .setCustomId("selectVacanciesChannel")
                .setPlaceholder("выберите канал с вакансиями")
                .setChannelTypes(ChannelType.GuildText)      
    )
    const btn = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
          .setCustomId("deleteExists")
          .setLabel("Удалить существующий канал")
          .setStyle(ButtonStyle.Danger),

      new ButtonBuilder()
          .setCustomId("publishVacancies")
          .setLabel('Опубликовать в существующий')
          .setStyle(ButtonStyle.Success),
          
      new ButtonBuilder()
          .setCustomId('vacansiesEmbedBuilder')
          .setLabel("Создать эмбед")
          .setStyle(ButtonStyle.Success)
    )

    await interaction.reply({embeds: [embed], components: [select, btn]})
  }
}