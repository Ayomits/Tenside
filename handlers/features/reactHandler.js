const {
  MessageActionRow,
  ButtonStyle,
  ComponentType,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
} = require("discord.js");
const path = require("path");
const fs = require("fs");

async function acceptable(
  message,
  embed,
  targetUser,
  authorId,
  reactionData,
  timeoutEmbed
) {
  const targetUserId = targetUser.id;
  const acceptableEmbed = new EmbedBuilder()
    .setTitle("Вопрос")
    .setDescription(
      `эй. ${targetUser}, тебя тут <@${authorId}> хочет ${reactionData.action} тебя. что скажешь`
    );
  const noEmbed = new EmbedBuilder()
    .setTitle("Отказ")
    .setDescription(
      `${targetUser}, решил(а) отказаться от предложения <@${authorId}>`
    );

  const button = new ButtonBuilder()
    .setCustomId(`${targetUserId}_yes`)
    .setLabel("Согласится")
    .setStyle(ButtonStyle.Success);
  const button2 = new ButtonBuilder()
    .setCustomId(`${targetUserId}_no`)
    .setLabel("Отказатся")
    .setStyle(ButtonStyle.Danger);
  const arrow = new ActionRowBuilder().setComponents(button, button2);
  const replyMessage = await message.reply({
    embeds: [acceptableEmbed],
    components: [arrow],
  });

  // Создаем коллектор для кнопок
  const collector = replyMessage.createMessageComponentCollector({
    componentType: ComponentType.Button,
    time: 15_000,
  });

  // Обрабатываем нажатия на кнопки
  collector.on("collect", async (inter) => {
    if (inter.customId === `${inter.user.id}_no`) {
      await inter.message.edit({ components: [], embeds: [noEmbed] });
    } else if (inter.customId === `${inter.user.id}_yes`) {
      embed.setDescription(
        `Пользователь <@${authorId}> ${reactionData.verbal} ${reactionData.memberVerb} ${targetUser}`
      );
      await inter.message.edit({ components: [], embeds: [embed] });
    }
  });

  // Обрабатываем завершение коллектора (например, из-за истечения времени)
  collector.on("end", (collected, reason) => {
    if (reason && reason !== "time") {
      console.error(`Collector ended due to an error: ${reason}`);
      // Можно обработать ошибку здесь, например, отправить сообщение пользователю или записать в лог.
    } else if (reason === "time") {
      replyMessage
        .edit({ components: [], embeds: [timeoutEmbed] })
        .catch(console.error);
    }
  });
}

async function react(message, reaction, url) {
  const baseDir = path.resolve("configs");
  const data = JSON.parse(
    await fs.promises.readFile(path.join(baseDir, "reactions.json"), "utf-8")
  );

  const reactionData = data[reaction];

  if (!reactionData) {
    throw new Error("Я такого не знать");
  }

  const authorId = message.author.id;
  const mentions = message.mentions;
  const targetUser = mentions.users.first();

  const embed = new EmbedBuilder()
    .setTitle(`Реакция ${reactionData.action}`)
    .setImage(url)
    .setFooter({
      iconURL: message.author.displayAvatarURL(),
      text: message.author.username,
    })
    .setTimestamp(Date.now())
    .setColor("#2F3136");

  const errorEmbed = new EmbedBuilder()
    .setTitle("Ошибка")
    .setDescription("Произошла ошибка")
    .setColor("#2F3136");

  const timeoutEmbed = new EmbedBuilder()
    .setTitle("Время вышло")
    .setDescription(`Время для реакции истекло.`)
    .setColor("#2F3136");

  const isEveryoneReaction = reactionData.everyone;
  const isAcceptable = reactionData.isAcceptable;
  const isNsfw = reactionData.nsfw;

  if (!isNsfw) {
    if (isEveryoneReaction === false) {
      // Проверяем, упоминается ли кто-то в сообщении
      if (mentions && mentions.users.size > 0) {
        if (message.author == mentions.users.first())
          return message.reply({ embeds: [errorEmbed] });
        const targetUser = mentions.users.first();
        // Проверяем, не является ли автор упоминаемым пользователем

        if (authorId === targetUser.id) {
          return await message.channel.send({ embeds: [errorEmbed] });
        }
        if (isAcceptable) {
          await acceptable(
            message,
            embed,
            targetUser,
            authorId,
            reactionData,
            timeoutEmbed
          );
        }
      }
    } else {
      if (mentions && mentions.users.size > 0) {
        const targetUser = mentions.users.first();
        if (authorId === targetUser.id) {
          return await message.channel.send({ embeds: [errorEmbed] });
        } else {
          embed.setDescription(
            `Пользователь <@${authorId}> ${reactionData.verbal} ${reactionData.memberVerb} ${targetUser}`
          );
          await message.reply({ embeds: [embed] });
        }
      } else {
        embed.setDescription(
          `Пользователь <@${authorId}> ${reactionData.verbal} ${reactionData.everyoneVerb}`
        );
        await message.reply({ embeds: [embed] });
      }
    }
  }
}

module.exports = react;
