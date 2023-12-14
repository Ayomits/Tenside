const { SlashCommandBuilder } = require("@discordjs/builders");
const {CommandInteraction, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, RoleSelectMenuBuilder, ChannelSelectMenuBuilder, TextChannel, ChannelType, PermissionFlagsBits} = require('discord.js')
const { systemMessageModel } = require("../../models/system_message");
const getChannel = require("../../functions/getChannel");

module.exports = {
  data: new SlashCommandBuilder()
        .setName("setupmodal")
        .setDescription("установка канала для публикации вакансий")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  
  /**
   * @param {CommandInteraction} interaction
   */

  async execute(interaction) {
    let channelId = await getChannel(systemMessageModel, interaction)
    const embed = new EmbedBuilder()
                  .setTitle("Установка канала для отправки вакансий")
                  .setTimestamp(Date.now())
                  .setFooter({iconURL: interaction.user.displayAvatarURL(), text: interaction.user.username})
    
    if (!channelId) {
      embed.setDescription(`Ваш канал: ${channelId.channel_id}`)
    }else {
      embed.setDescription(`Ваш канал: <#${channelId.channel_id}>`)
    }

    const select = new ActionRowBuilder().addComponents(
                new ChannelSelectMenuBuilder()
                .setCustomId("selectVacanciesChannel")
                .setPlaceholder("выберите канал с вакансиями")
                .setChannelTypes(ChannelType.GuildText)      
    )
    const select2 = new ActionRowBuilder().addComponents(
      new ChannelSelectMenuBuilder()
      .setCustomId("setRecrutChannel")
      .setPlaceholder("выберите канал после заполнения")
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

    
    await interaction.reply({embeds: [embed], components: [select, select2, btn ]})
  }
}