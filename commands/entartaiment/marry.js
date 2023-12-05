const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle,ComponentType } = require("discord.js");
const { userModel } = require("../.././models/users");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("marry")
    .setDescription("предложить брак пользователю")
    .addUserOption((option) =>
      option.setName("target").setDescription("target user").setRequired(true)
    ),

  /**
   *
   * @param {CommandInteraction} interaction
   */

// ...

async execute(interaction) {
  const target = interaction.options.get("target");
  const user = interaction.user;

  const timeoutEmbed = new EmbedBuilder()
    .setTitle("Время вышло")
    .setDescription(`Время для реакции истекло.`)
    .setColor("#2F3136");

  const erroEmbed = new EmbedBuilder()
    .setTitle("Система браков")
    .setDescription("У выбранного пользователя уже имеется партнёр");

  const requestEmbed = new EmbedBuilder()
    .setTitle("Система браков")
    .setDescription(`Уважаемый пользователь <@${target.user.id}>, хотите ли вы заключить брак с пользователем <@${interaction.user.id}>?`)
    .setImage("https://i.pinimg.com/originals/6a/fe/22/6afe2295e4523d5bc8bd4027887e4c06.gif");

  const acceptEmbed = new EmbedBuilder()
    .setTitle("Система браков")
    .setDescription("Я - как посланник моего разработчика, объявляю ваш брак успешным. Пусть в вашей дальнейшей совместной жизни будет много счастья и любви!")
    .setImage("https://i.pinimg.com/originals/7c/77/f8/7c77f8d1a4ced504204a54774abec72f.gif");

  const cancelEmbed = new EmbedBuilder()
    .setTitle("Система браков")
    .setDescription("Видимо, сегодня вам не светит быть в браке :(");

  const acceptbutton = new ButtonBuilder()
    .setCustomId(`${target.user.id}_yes`)
    .setEmoji(`✅`)
    .setStyle(ButtonStyle.Secondary);

  const cancelbutton = new ButtonBuilder()
    .setCustomId(`${target.user.id}_no`)
    .setEmoji(`⛔`)
    .setStyle(ButtonStyle.Secondary);

  const requestbuttons = new ActionRowBuilder().setComponents(acceptbutton, cancelbutton);

  if (user.id === target.user.id) {
    return await interaction.reply({ content: "Такого делать нельзя", ephemeral: true });
  }

  const targetUser = await userModel.findOne({
    guild_id: interaction.guildId,
    user_id: target.user.id,
    married: { $ne: null },
  });

  const authorUser = await userModel.findOne({
    guild_id: interaction.guildId,
    user_id: interaction.user.id,
    married: { $ne: null },
  });

  // Проверка, состоит ли автор команды уже в браке
  if (authorUser) {
    return await interaction.reply({
      content: "Вы уже состоите в браке!",
      ephemeral: true,
    });
  }

  // Проверка, состоит ли целевой пользователь уже в браке
  if (targetUser) {
    return await interaction.reply({ embeds: [erroEmbed] });
  }

  const replyMessage = await interaction.reply({ embeds: [requestEmbed],content:`<@${target.user.id}>`, components: [requestbuttons] });
  const collector = replyMessage.createMessageComponentCollector({
    componentType: ComponentType.Button,
    time: 15_000,
  });

  let isClicked = false;

  // Обрабатываем нажатия на кнопки
  collector.once("collect", async (inter) => {
    if (inter.customId === `${inter.user.id}_no`) {
      await replyMessage.edit({ components: [], embeds: [cancelEmbed] });
      isClicked = true;
    } else if (inter.customId === `${inter.user.id}_yes`) {
      const authorUser = userModel.create({
        guild_id: interaction.guild.id,
      user_id: interaction.user.id,
    married:target.id      })
    const targetUser = userModel.create({
      guild_id: interaction.guild.id,
    user_id: target.user.id,
  married:interaction.user.id      })
      
      await replyMessage.edit({ components: [], embeds: [acceptEmbed] });
      isClicked = true;
    }
  });

  // Обрабатываем завершение коллектора (например, из-за истечения времени)
  collector.once("end", async (collected, reason) => {
    if (!isClicked) {
      if (reason && reason !== "time") {
        console.error(`Collector ended due to an error: ${reason}`);
        // Можно обработать ошибку здесь, например, отправить сообщение пользователю или записать в лог.
      } else if (reason === "time") {
        await replyMessage.edit({ components: [], embeds: [timeoutEmbed] }).catch(console.error);
      }
    } else {
      return;
    }
  });
}

}