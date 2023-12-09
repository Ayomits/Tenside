const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  CommandInteraction,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ComponentType,
} = require("discord.js");
const { userModel, marryModel } = require("../.././models/users");

/**
   * 
   * @param {CommandInteraction} interaction 
   * @returns 
   */

module.exports = {
  data: new SlashCommandBuilder()
    .setName("marry")
    .setDescription("предложить брак пользователю")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("Целевой пользователь")
        .setRequired(true)
    ),

  async execute(interaction) {
    const target = interaction.options.getUser("target");
    const author = interaction.user;

    // Проверка на попытку брака с самим собой
    if (author.id === target.id) {
      return await interaction.reply({
        content: "Такого делать нельзя",
        ephemeral: true,
      });
    }

    // Проверка, не состоит ли автор уже в браке
    const authorUserMarry = await marryModel.findOne({
      guild_id: interaction.guild.id,
      $or: [{ partner1_id: author.id }, { partner2_id: author.id }],
    });
    const authorUser = await userModel.findOne({
      guild_id: interaction.guild.id,
      user_id: author.id,
    });
    const targetUser = await userModel.findOne({
      guild_id: target.id,
      user_id: author.id,
    });
    if (authorUserMarry) {
      return await interaction.reply({
        content: "Вы уже состоите в браке!",
        ephemeral: true,
      });
    }

    // Проверка, не имеет ли выбранный пользователь уже партнера
    const targetUserMarry = await marryModel.findOne({
      guild_id: interaction.guild.id,
      $or: [{ partner1_id: target.id }, { partner2_id: target.id }],
    });

    if (targetUserMarry) {
      const erroEmbed = new EmbedBuilder()
        .setTitle("Система браков")
        .setDescription("У выбранного пользователя уже имеется партнёр")
        .setColor("#2F3136");
      return await interaction.reply({ embeds: [erroEmbed] });
    }

    // Проверка баланса автора для проведения свадьбы
    if (authorUser.balance < 2000) {
      return await interaction.reply({
        content: "У вас недостаточно валюты для проведения свадьбы.",
        ephemeral: true,
      });
    }

    // Создание сообщения с предложением брака
    const requestEmbed = new EmbedBuilder()
      .setTitle("Система браков")
      .setDescription(
        `Уважаемый пользователь <@${target.id}>, хотите ли вы заключить брак с пользователем <@${author.id}>?`
      )
      .setImage(
        "https://i.pinimg.com/originals/6a/fe/22/6afe2295e4523d5bc8bd4027887e4c06.gif"
      )
      .setColor("#2F3136");

    // Создание кнопок для подтверждения/отмены брака
    const acceptbutton = new ButtonBuilder()
      .setCustomId(`${target.id}_yes`)
      .setEmoji(`✅`)
      .setStyle(ButtonStyle.Secondary);
    const cancelbutton = new ButtonBuilder()
      .setCustomId(`${target.id}_no`)
      .setEmoji(`⛔`)
      .setStyle(ButtonStyle.Secondary);

    const requestbuttons = new ActionRowBuilder().setComponents(
      acceptbutton,
      cancelbutton
    );

    // Отправка предложения брака
    const replyMessage = await interaction.reply({
      embeds: [requestEmbed],
      content: `<@${target.id}>`,
      components: [requestbuttons],
    });

    // Ожидание ответа от пользователя
    const collector = replyMessage.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 60000,
    });

    collector.on("collect", async (buttonInteraction) => {
      if (buttonInteraction.customId === `${target.id}_no`) {
        if(buttonInteraction.user.id === target.id) {
        const cancelEmbed = new EmbedBuilder()
          .setTitle("Система браков")
          .setDescription("Видимо, сегодня вам не светит быть в браке :(")
          .setColor("#2F3136");
        await replyMessage.edit({ components: [], embeds: [cancelEmbed] });
        collector.stop();
      }
      } else if (buttonInteraction.customId === `${target.id}_yes`) {
        if(buttonInteraction.user.id === target.id) {
          const updated1 = await userModel.updateOne(
            {
              guild_id: interaction.guild.id,
              user_id: interaction.user.id,
            },
            { $inc: { balance: -2000 } }
          );

          const marry = await marryModel.create({
            guild_id: interaction.guild.id,
            partner1_id: author.id,
            partner2_id: target.id,
          });

          if (updated1 && marry) {
            const acceptEmbed = new EmbedBuilder()
              .setTitle("Система браков")
              .setDescription(
                `**Я** - как посланник моего разработчика, объявляю брак между <@${author.id}> и <@${target.id}> успешным. Пусть в вашей дальнейшей совместной жизни будет много счастья и любви!`
              )
              .setImage(
                "https://i.pinimg.com/originals/7c/77/f8/7c77f8d1a4ced504204a54774abec72f.gif"
              )
              .setColor("#2F3136");
            await replyMessage.edit({ components: [], embeds: [acceptEmbed] });
          } else {
            console.log("Что-то пошло не так");
          }
          collector.stop();
      }
    }
    });

    collector.on("end", (collected, reason) => {
      if (reason && reason !== "time") {
        console.error(`Collector ended due to an error: ${reason}`);
      } else if (reason === "time") {
        const timeoutEmbed = new EmbedBuilder()
          .setTitle("Время вышло")
          .setDescription(`Время для реакции истекло.`)
          .setColor("#2F3136");
        replyMessage
          .edit({ components: [], embeds: [timeoutEmbed] })
          .catch(console.error);
      }
    });
  },
};
