const { EmbedBuilder } = require("discord.js");
const path = require("path");
const fs = require("fs");
const axios = require("axios");

/**
 *
 * @param {Message} message
 * @param {String} reaction
 * @param {String} action
 * @param {axios.AxiosResponse} resp
 */

async function react(message, reaction, resp) {
  console.log("вызвано");
  const baseDir = path.resolve("configs");
  const data = JSON.parse(
    await fs.promises.readFile(baseDir + "/reactions.json", "utf-8")
  );
  const reactionData = data[reaction[0]];

  if (!reactionData) {
    throw new Error("Я такого не знать");
  }

  const errorEmbed = new EmbedBuilder()
    .setTitle("Ошибка")
    .setDescription("Нельзя применить команду на себя");

  const isEveryoneReaction = reactionData.everyone;
  const authorId = message.author.id;
  const mentions = message.mentions;

  const embed = new EmbedBuilder()
    .setTitle(`Реакция ${reactionData.action}`)
    .setImage(resp.data.url)
    .setFooter({
      iconURL: message.author.displayAvatarURL(),
      text: message.author.username,
    })
    .setTimestamp(Date.now())
    .setColor("#2F3136");

  if (isEveryoneReaction) {
    if (mentions && mentions.users.size > 0) {
      const targetUser = mentions.users.first();
      if (authorId === targetUser.id)
        return await message.channel.send({ embeds: [errorEmbed] });
      embed.setDescription(
        `Пользователь <@${authorId}> ${reactionData.verbal} ${reactionData.memberVerb} ${targetUser} `
      );
    } else {
      embed.setDescription(
        `Пользователь <@${authorId}> ${reactionData.verbal} ${reactionData.everyoneVerb} `
      );
    }
  } else {
    if (mentions && mentions.users.size > 0) {
      const targetUser = mentions.users.first();
      embed.setDescription(
        `Пользователь <@${authorId}> ${reactionData.verbal} ${reactionData.memberVerb} ${targetUser} `
      );
    } else {
      throw new Error("В пингуемой команде не пингуюмую");
    }
  }

  return await message.channel.send({ embeds: [embed] });
}

module.exports = react;
