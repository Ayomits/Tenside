const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  ComponentType,
} = require("discord.js");
const { userModel, marryModel } = require("../../models/users");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("divorce")
    .setDescription("Запрос на развод"),

  async execute(interaction) {
    const userExists = await marryModel.findOne({
      $or: [
        { partner1_id: interaction.user.id },
        { partner2_id: interaction.user.id },
      ],
    });

    if (!userExists) {
      const erroEmbed = new EmbedBuilder()
        .setTitle("Система разводов")
        .setDescription("У вас нет брака");
      return await interaction.reply({ embeds: [erroEmbed] });
    } else {
      const authorUser = await userModel.findOne({
        user_id: interaction.user.id,
        guild_id: interaction.guild.id,
      });
      const marriedUser = await userModel.findOne({
        user_id:
          userExists.partner1_id !== interaction.user.id
            ? userExists.partner1_id
            : userExists.partner2_id,
        guild_id: interaction.guildId,
      });
      if (authorUser.balance < 1000) {
        return await interaction.reply({
          content:
            "У вас или у вашего партнера недостаточно валюты для оплаты развода.",
          ephemeral: true,
        });
      } else {
        await userExists.deleteOne({});
        const acceptEmbed = new EmbedBuilder()
          .setTitle("Система развода")
          .setDescription(
            `Поздравляем! Развод между <@${interaction.user.id}> и <@${marriedUser.user_id}> успешно завершен. Пусть каждый идет своим путем.`
          )
          .setImage("https://example.com/divorce_success_gif.gif");
        return await interaction.reply({ embeds: [acceptEmbed] });
      }
    }
  },
};
