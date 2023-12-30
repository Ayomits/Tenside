const {
  MessageActionRow,
  ButtonStyle,
  ComponentType,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  Message,
} = require("discord.js");
const path = require("path");
const fs = require("fs");
const { userModel } = require("../../models/users");
const { time } = require("console");

/**
 *
 * @param {Message} message
 * @param {String} reaction
 * @param {String} url
 */

async function react(message, reaction, url) {
  const baseDir = path.resolve("configs");
  const reactionsData = JSON.parse(
    await fs.promises.readFile(path.join(baseDir, "reactions.json"), "utf-8")
  );
  const reactionData = reactionsData[reaction];

  if (!reactionData) {
    throw new Error("Я такого не знать");
  }

  const authorId = message.author.id;
  const mentions = message.mentions;
  const targetUser = mentions?.users.first();

  const action = reactionData.action;

  

  const botErrorEmbed = new EmbedBuilder()
    .setTitle("Ошибка")
    .setDescription(
      "Я тоже считаю, что боты живые, но может быть ты выберешь пользователя?"
    )
    .setColor("#2F3136");

  const authorErrorEmbed = new EmbedBuilder()
    .setTitle("Ошибка")
    .setDescription(
      "Тебе так одиноко? Понимаю, но всё же, выбери другого пользователя, а не себя!"
    )
    .setColor("#2F3136");

  const timeoutEmbed = new EmbedBuilder()
    .setTitle("Время вышло")
    .setDescription(`Время для реакции истекло.`)
    .setColor("#2F3136");

  const isEveryoneReaction = reactionData.everyone;
  const isAcceptable = reactionData.isAcceptable;
  const isNsfw = reactionData.nsfw;
  const cost_ = reactionData.cost;
  const checkMoney = await userMoneyCheck(
    message.author.id,
    message.guildId,
    cost_
  );

  const embed = new EmbedBuilder()
    .setTitle(`Реакция: ${action.toLowerCase()}`)
    .setImage(url)
    .setFooter({
      iconURL: message.author.displayAvatarURL(),
      text: `${message.author.username} ${cost_} ${process.env.MONEY_STICKER}`,
    })
    .setTimestamp(Date.now())
    .setColor("#2F3136");

    if (!isNsfw) {
      if (checkMoney) {
      await reactionPayment(authorId, message.guildId, cost_)  
      if (!isEveryoneReaction) {
        if (targetUser) {
          if (checkAuthorAndBot(targetUser, authorId)) {
            if (isAcceptable) {
              await acceptable(message, embed, targetUser, authorId, reactionData, timeoutEmbed);
            } else {
              const description = await reactionPingGenerate(reactionData, authorId, targetUser.id, 'ping');
              await message.reply({embeds: [embed.setDescription(description)]});
            }
          } else {
            await message.reply({embeds: [authorErrorEmbed.setDescription("Укажите корректного пользователя")]});
          }
        } else {
          await message.reply({embeds: [authorErrorEmbed.setDescription("Укажите пользователя")]});
        }
      } else {
        if (targetUser) {
          if (checkAuthorAndBot(targetUser, authorId)) {
            const description = await reactionPingGenerate(reactionData, authorId, targetUser.id, 'ping');
            await message.reply({embeds: [embed.setDescription(description)]});
          }else {
            await message.reply({embeds: [authorErrorEmbed.setDescription("Укажите корректного пользователя")]});
        }
        } else {
          const description = `Пользователь <@${authorId}> ${reactionData.verbal} ${reactionData.everyoneVerb}`;
          await message.reply({embeds: [embed.setDescription(description)]});
        }
      }
    }else {
      await message.reply({embeds: [authorErrorEmbed.setDescription("У вас недостаточно денег на реакцию")]})
    }
  } 
} 

function checkAuthorAndBot(targetUser, authorId) {
  return !(targetUser.bot || targetUser.id === authorId);
}

async function reactionPingGenerate(reactionData, authorId, targetUserId, type) {
  const authorMention = `<@${authorId}>`;
  const targetUserMention = `<@${targetUserId}>`;
  
  if (type === "ping") {
    return `Пользователь ${authorMention} ${reactionData.verbal} ${reactionData.memberVerb} ${targetUserMention}`;
  }
}

async function reactionPayment(userId, guildId, cost) {
  await userModel.updateOne(
    { guild_id: guildId, user_id: userId },
    { $inc: { balance: -cost } }
  );
}

async function userMoneyCheck(userId, guildId, amount) {
  const result = await userModel.findOne({
    guild_id: guildId,
    user_id: userId,
  });
  return result.balance >= amount;
}


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
    .setTitle(`Реакция: ${reactionData.action.toLowerCase()}`)
    .setDescription(
      `Эй, ${targetUser}, тебя тут <@${authorId}> хочет ${reactionData.action.toLowerCase()}, что скажешь?`
    )
    .setFooter({
      iconURL: message.author.displayAvatarURL(),
      text: message.author.username,
    });
  const noEmbed = new EmbedBuilder()
    .setTitle(`Реакция: ${reactionData.action.toLowerCase()}`)
    .setDescription(
      `${targetUser}, решил(а) отказаться от предложения <@${authorId}>`
    );

  const button = new ButtonBuilder()
    .setCustomId(`${targetUserId}_yes`)
    .setEmoji("✅")
    .setStyle(ButtonStyle.Secondary);
  const button2 = new ButtonBuilder()
    .setCustomId(`${targetUserId}_no`)
    .setEmoji("❌")
    .setStyle(ButtonStyle.Secondary);
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

  let isClicked = false;

  // Обрабатываем нажатия на кнопки
  collector.once("collect", async (inter) => {
    if (inter.customId === `${inter.user.id}_no`) {
      if (inter.user.id === targetUser.id) {
        await inter.message.edit({ components: [], embeds: [noEmbed] });
        isClicked = true;
      }
      
    } else if (inter.customId === `${inter.user.id}_yes`) {
      if (inter.user.id === targetUser.id) {
        embed.setDescription(
          `Пользователь <@${authorId}> ${reactionData.verbal} ${reactionData.memberVerb} ${targetUser}`
        );
        await inter.message.edit({ components: [], embeds: [embed] });
        isClicked = true;
      }
    }
  });

  // Обрабатываем завершение коллектора (например, из-за истечения времени)
  collector.once("end", (collected, reason) => {
    if (!isClicked) {
      if (reason && reason !== "time") {
        console.error(`Collector ended due to an error: ${reason}`);
        // Можно обработать ошибку здесь, например, отправить сообщение пользователю или записать в лог.
      } else if (reason === "time") {
        replyMessage
          .edit({ components: [], embeds: [timeoutEmbed] })
          .catch(console.error);
      }
    } else {
      return;
    }
  });
}

module.exports = react;
