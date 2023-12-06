const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, ComponentType } = require("discord.js");
const { userModel } = require("../.././models/users");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("divorce")
    .setDescription("Запрос на развод")
    .addUserOption((option) =>
      option.setName("partner").setDescription("Пользователь, с которым вы хотите развестись").setRequired(true)
    ),

  async execute(interaction) {
    const partner = interaction.options.get("partner")
    const author = interaction.user;

    const erroEmbed = new EmbedBuilder()
      .setTitle("Система разводов")
      .setDescription("Выбранный пользователь уже в разводе");

    const timeoutEmbed = new EmbedBuilder()
      .setTitle("Время вышло")
      .setDescription(`Время для реакции истекло.`)
      .setColor("#2F3136");

    const requestEmbed = new EmbedBuilder()
      .setTitle("Система развода")
      .setDescription(`Уважаемый пользователь <@${partner.user.id}>, ${author.username} предлагает вам развод. Желаете ли вы развестись?`)
      .setImage("https://example.com/divorce_gif.gif");

    const acceptEmbed = new EmbedBuilder()
      .setTitle("Система развода")
      .setDescription(`Поздравляем! Развод между вами и <@${partner.user.id}> успешно завершен. Пусть каждый идет своим путем.`)
      .setImage("https://example.com/divorce_success_gif.gif");

    const cancelEmbed = new EmbedBuilder()
      .setTitle("Система развода")
      .setDescription(`Вы отказались от развода с <@${partner.user.id}>. Пожалуйста, подумайте еще раз.`);

    const acceptButton = new ButtonBuilder()
      .setCustomId(`${partner.user.id}_divorce_yes`)
      .setEmoji(`✅`)
      .setStyle(ButtonStyle.Secondary);

    const cancelButton = new ButtonBuilder()
      .setCustomId(`${partner.user.id}_divorce_no`)
      .setEmoji(`⛔`)
      .setStyle(ButtonStyle.Secondary);

    const requestButtons = new ActionRowBuilder().setComponents(acceptButton, cancelButton);

    if (author.id === partner.user.id) {
      return await interaction.reply({ content: "Такого делать нельзя", ephemeral: true });
    }

    const targetUser = await userModel.findOne({
      guild_id: interaction.guildId,
      user_id: partner.user.id,
    });

    const authorUser = await userModel.findOne({
      guild_id: interaction.guildId,
      user_id: interaction.user.id,
    });

    if (!authorUser.married || authorUser.married !== partner.user.id) {
      return await interaction.reply({
        content: "Вы не состоите в браке с выбранным пользователем!",
        ephemeral: true,
      });
    }

    if (!targetUser.married || targetUser.married !== interaction.user.id) {
      return await interaction.reply({ embeds: [erroEmbed] });
    }

    if (authorUser.balance < 1000 || targetUser.balance < 1000) {
      return await interaction.reply({
        content: "У вас или у вашего партнера недостаточно валюты для оплаты развода.",
        ephemeral: true,
      });
    }

    // Deduct the cost from both users' balances
    const updatedAuthorBalance = authorUser.balance - 1000;
            const updatedTargetBalance = targetUser.balance - 1000;
        
            await userModel.updateOne({
              guild_id: interaction.guild.id,
              user_id: interaction.user.id,
            }, {
              married: null,
              balance: updatedAuthorBalance,
            });
        
            await userModel.updateOne({
              guild_id: interaction.guild.id,
              user_id: partner.user.id,
            }, {
              married: null,
              balance: updatedTargetBalance,
            });

    // Send the divorce request
    const replyMessage = await interaction.reply({
        embeds: [acceptEmbed],
        content: `<@${partner.user.id}>`,
      
      });
      
     
      
      }}