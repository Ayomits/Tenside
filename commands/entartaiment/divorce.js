const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, ComponentType } = require("discord.js");
const { userModel } = require("../../models/users");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("divorce")
    .setDescription("Запрос на развод"),

  async execute(interaction) {
    
    const authorUser = await userModel.findOne({
      guild_id: interaction.guildId,
      user_id: interaction.user.id,
    });

    if (!authorUser.married) {
      const erroEmbed = new EmbedBuilder()
      .setTitle("Система разводов")
      .setDescription("У вас нет брака");
      return await interaction.reply({embeds: [erroEmbed]})
    }

    const marriedUser = await userModel.findOne({guild_id: interaction.guildId, user_id: authorUser.married})

    if (authorUser.balance < 1000) {
      return await interaction.reply({
        content: "У вас или у вашего партнера недостаточно валюты для оплаты развода.",
        ephemeral: true,
      }) ;
    } else {
      await userModel.updateMany({user_id: [authorUser.user_id], guild_id: interaction.guildId}, {$inc: {balance: -1000}, married: null})
      const acceptEmbed = new EmbedBuilder()
      .setTitle("Система развода")
      .setDescription(`Поздравляем! Развод между <@${interaction.user.id}> и <@${marriedUser.user_id}> успешно завершен. Пусть каждый идет своим путем.`)
      .setImage("https://example.com/divorce_success_gif.gif");
      return await interaction.reply({embeds: [acceptEmbed]})
    }
}}