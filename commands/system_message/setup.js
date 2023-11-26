const { SlashCommandBuilder } = require("@discordjs/builders");
const {CommandInteraction, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, RoleSelectMenuBuilder, ChannelSelectMenuBuilder, TextChannel, ChannelType} = require('discord.js')
const { systemMessageModel, systemAnketa } = require("../../models/system_message/models");

module.exports = {
  data: new SlashCommandBuilder()
        .setName("setupmodal")
        .setDescription("установка канала для публикации вакансий"),
  
  /**
   * @param {CommandInteraction} interaction
   */

  async execute(interaction) {
    let channelId
    await systemMessageModel.findOne({
      where: {
        guild_id: interaction.guildId
      }
    }).then((result) => {
      channelId = result.dataValues.channel_id
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
      console.log(String(channelId));
      const channel = interaction.guild.channels.cache.get(String(channelId))
      console.log(channel);
      embed.setDescription(`Ваш канал: <#${channelId}>`)
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