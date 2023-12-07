const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  CommandInteraction,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  ComponentType,
} = require("discord.js");
const { userModel } = require("../.././models/users");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("marry")
    .setDescription("предложить брак пользователю")
    .addUserOption((option) =>
      option.setName("target").setDescription("target user").setRequired(true)
    ),

  async execute(interaction) {
    const target = interaction.options.get("target");
    const user = interaction.user;
    const author = interaction.user;
    const timeoutEmbed = new EmbedBuilder()
      .setTitle("Время вышло")
      .setDescription(`Время для реакции истекло.`)
      .setColor("#2F3136");

    const requestEmbed = new EmbedBuilder()
      .setTitle("Система браков")
      .setDescription(
        `Уважаемый пользователь <@${target.user.id}>, хотите ли вы заключить брак с пользователем <@${interaction.user.id}>?`
      )
      .setImage(
        "https://i.pinimg.com/originals/6a/fe/22/6afe2295e4523d5bc8bd4027887e4c06.gif"
      )
      .setColor("#2F3136");

    const acceptbutton = new ButtonBuilder()
      .setCustomId(`${target.user.id}_yes`)
      .setEmoji(`✅`)
      .setStyle(ButtonStyle.Secondary);

    const cancelbutton = new ButtonBuilder()
      .setCustomId(`${target.user.id}_no`)
      .setEmoji(`⛔`)
      .setStyle(ButtonStyle.Secondary);

    const requestbuttons = new ActionRowBuilder().setComponents(
      acceptbutton,
      cancelbutton
    );

    if (user.id === target.user.id) {
      return await interaction.reply({
        content: "Такого делать нельзя",
        ephemeral: true,
      });
    }

    const targetUser = await userModel.findOne({
      guild_id: interaction.guildId,
      user_id: target.user.id,
    });

    const authorUser = await userModel.findOne({
      guild_id: interaction.guildId,
      user_id: interaction.user.id,
    });

    if (authorUser.married) {
      return await interaction.reply({
        content: "Вы уже состоите в браке!",
        ephemeral: true,
      });
    }

    if (targetUser && targetUser.married) {
      const erroEmbed = new EmbedBuilder()
        .setTitle("Система браков")
        .setDescription("У выбранного пользователя уже имеется партнёр")
        .setColor("#2F3136");
      return await interaction.reply({ embeds: [erroEmbed] });
    }
    if (authorUser.balance < 2000) {
      return await interaction.reply({
        content: "У вас недостаточно валюты для проведения свадьбы.",
        ephemeral: true,
      });
    }

    const replyMessage = await interaction.reply({
      embeds: [requestEmbed],
      content: `<@${target.user.id}>`,
      components: [requestbuttons],
    });

    const collector = replyMessage.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 60_000,
    });

    let isClicked = false;

    collector.once("collect", async (inter) => {
      if (inter.customId === `${target.user.id}_no`) {
        if (inter.user.id === target.user.id) {
          const cancelEmbed = new EmbedBuilder()
            .setTitle("Система браков")
            .setDescription("Видимо, сегодня вам не светит быть в браке :(")
            .setColor("#2F3136");
          await replyMessage.edit({ components: [], embeds: [cancelEmbed] });
          isClicked = true;
        }
      } else if (inter.customId === `${target.user.id}_yes`) {
        if (inter.user.id === target.user.id) {
          const updated1 = await userModel.updateOne(
            {
              guild_id: inter.guildId,
              user_id: target.user.id,
            },
            { $set: { married: author.id }, $inc: {balance: -2000} }
          );
          const updated2 = await userModel.updateOne(
            {
              guild_id: inter.guildId,
              user_id: author.id,
            },
            { $set: { married: target.user.id } }
          );

          if (updated1 && updated2) {
            const acceptEmbed = new EmbedBuilder()
              .setTitle("Система браков")
              .setDescription(
                "**Я** - как посланник моего разработчика, объявляю ваш брак **успешным**.\n *Пусть в вашей дальнейшей совместной жизни будет много счастья и любви!*"
              )
              .setImage(
                "https://i.pinimg.com/originals/7c/77/f8/7c77f8d1a4ced504204a54774abec72f.gif"
              )
              .setColor("#2F3136")
            await replyMessage.edit({ components: [], embeds: [acceptEmbed] });
          } else {
            console.log("что-то пошло не так");
          }
          isClicked = true;
        }
      }
    });

    collector.once("end", async (collected, reason) => {
      if (!isClicked) {
        if (reason && reason !== "time") {
          console.error(`Collector ended due to an error: ${reason}`);
        } else if (reason === "time") {
          await replyMessage
            .edit({ components: [], embeds: [timeoutEmbed] })
            .catch(console.error);
        }
      }
    });
  },
};
