const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, EmbedBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelSelectMenuBuilder, ChannelType } = require("discord.js")
const { ticketSettings } = require("../../models/tickets/models")

module.exports = {
  data: new SlashCommandBuilder()
        .setName("setupticket")
        .setDescription("настройки тикетов")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  
  /**
   * 
   * @param {CommandInteraction} interaction 
   */

  async execute(interaction) {
    let channelId = ""
    await ticketSettings.findOne({where: {guild_id: interaction.guildId}}).then(async (result) => {
      channelId = result.dataValues.channel_id
    }).catch(() => {
      channelId = "отсутствует"
    })
    
    const embed = new EmbedBuilder()
                .setTitle("Настройки тикетов")
                .setDescription(`Ваш канал: <#${channelId}>`)
                .setFooter({iconURL: interaction.user.displayAvatarURL(), text: interaction.user.username})
                .setColor("#2F3136")
    
    const setChannelSelect = new ActionRowBuilder().addComponents(
      new ChannelSelectMenuBuilder()
          .setChannelTypes(ChannelType.GuildText)
          .setCustomId("setChannelSelect")
          .setPlaceholder("выберите канал с тикетами")
    )

    const settings = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
          .setCustomId("setTheme")
          .setLabel("Установить темы")
          .setStyle(ButtonStyle.Success),

      new ButtonBuilder()
          .setCustomId("deleteTheme")
          .setLabel("Удалить темы")
          .setStyle(ButtonStyle.Danger),

      new ButtonBuilder()
          .setCustomId("deleteChannelBtn")
          .setLabel("Удалить текущий канал")
          .setStyle(ButtonStyle.Danger),   
      
      new ButtonBuilder()
          .setCustomId("publishTickets")
          .setLabel("опубликовать тикеты")
          .set
    )

    await interaction.reply({embeds: [embed], components: [setChannelSelect, settings]})
    
  }
}