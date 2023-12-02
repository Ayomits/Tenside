const { MessageActionRow, ButtonStyle, ComponentType, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const path = require("path");
const fs = require("fs");

async function react(message, reaction, url) {
 if (message.mentions.users.size == 0) return
  if(message.author.bot) return
   console.log("вызвано");

  const baseDir = path.resolve("configs");
  const data = JSON.parse(await fs.promises.readFile(path.join(baseDir, "reactions.json"), "utf-8"));

  const reactionKey = Object.keys(data).find((key) => data[key].aliases?.includes(reaction[0])) || reaction[0];
  const reactionData = data[reactionKey];

  if (!reactionData) {
    throw new Error("Я такого не знать");
  }

  const authorId = message.author.id;
  const mentions = message.mentions;
  const targetUser = mentions.users.first();
  const targetUserId = targetUser?.id;

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
    .setDescription("Произошла ошибка");

  const timeoutEmbed = new EmbedBuilder()
    .setTitle("Время вышло")
    .setDescription(`Время для реакции истекло.`);

  const isEveryoneReaction = reactionData.everyone;
  const isAcceptable = reactionData.isAcceptable;
  const isNsfw = reactionData.nsfw;
if (message.author.id == mentions.users.first().id || mentions.users.size == 0) return message.reply({embeds:[errorEmbed], ephemeral: true, ephemeral: true, ephemeral: true})

  if (!isNsfw){
  
  // Проверяем, реакция для всех ли участников сервера
  if (isEveryoneReaction) {
    // Проверяем, упоминается ли кто-то в сообщении
    if (mentions && mentions.users.size > 0) {
      
      const targetUser = mentions.users.first();
      // Проверяем, не является ли автор упоминаемым пользователем
      if (authorId === targetUser.id || targetUser == message.user.bot) {
        return await message.channel.send({ embeds: [errorEmbed], ephemeral: true, ephemeral: true });
      }

    if (isAcceptable) {
      
        const acceptableEmbed = new EmbedBuilder()
          .setTitle("Вопрос")
          .setDescription(`эй. ${targetUser}, тебя тут <@${authorId}> хочет ${reactionData.action} тебя. что скажешь`);
        const noEmbed = new EmbedBuilder()
          .setTitle("Отказ")
          .setDescription(`${targetUser}, решил(а) отказаться от предложения <@${authorId}>`);
    
        const button = new ButtonBuilder().setCustomId(`${targetUserId}_yes`).setLabel("Согласится").setStyle(ButtonStyle.Success);
        const button2 = new ButtonBuilder().setCustomId(`${targetUserId}_no`).setLabel("Отказатся").setStyle(ButtonStyle.Danger);
        const arrow = new ActionRowBuilder().setComponents(button, button2);
        const replyMessage = await message.reply({ embeds: [acceptableEmbed], components: [arrow] });

        // Создаем коллектор для кнопок
        const collector = replyMessage.createMessageComponentCollector({ componentType: ComponentType.Button, time: 100_000 });
    
        // Обрабатываем нажатия на кнопки
        collector.on("collect", async (inter) => {
          if (inter.customId === `${inter.user.id}_no`) {
            await inter.message.edit({ components: [], embeds: [noEmbed] });
          } else if (inter.customId === `${inter.user.id}_yes`) {
            embed.setDescription(`Пользователь <@${authorId}> ${reactionData.verbal} ${reactionData.memberVerb} ${targetUser}`);
            await inter.message.edit({ components: [], embeds: [embed] });
          }   
        });
    
        // Обрабатываем завершение коллектора (например, из-за истечения времени)
        collector.on("end", (collected, reason) => {
          if (reason && reason !== "time") {
            console.error(`Collector ended due to an error: ${reason}`);
            // Можно обработать ошибку здесь, например, отправить сообщение пользователю или записать в лог.
          } else if (reason === "time") {
            replyMessage.edit({ components: [], embeds: [timeoutEmbed] }).catch(console.error);
          }
        }); } else {
          embed.setDescription(
            `Пользователь <@${authorId}> ${reactionData.verbal} ${reactionData.memberVerb} ${targetUser} `
          );
          message.reply({embeds:[embed]})
        }
    
    
    }else {
      embed.setDescription(
        `Пользователь <@${authorId}> ${reactionData.verbal} ${reactionData.everyoneVerb} `
      ); message.reply({embeds:[embed]})
    }}else {
      if (mentions && mentions.users.size > 0) {
        const targetUser = mentions.users.first();
        embed.setDescription(
          `Пользователь <@${authorId}> ${reactionData.verbal} ${reactionData.memberVerb} ${targetUser} `
        );message.reply({embeds:[embed]})}}}
  // Если нет упоминаемого пользователя, проверяем NSFW-канал и отправляем сообщение с реакцией
  if (!targetUser) {
    if (isNsfw && !message.channel.nsfw) {
      message.reply({ content: "Вы должны использовать это в NSFW-канале!", ephemeral: true });
      return;
    }

    if (isNsfw) {
    console.log(`1`);
    
  return  message.reply({embeds:[errorEmbed], ephemeral: true,})
    
}
  }

  // Если реакция требует подтверждения, создаем сообщение с кнопками
  if (isAcceptable) {
    const acceptableEmbed = new EmbedBuilder()
      .setTitle("Вопрос")
      .setDescription(`эй. ${targetUser}, тебя тут <@${authorId}> хочет ${reactionData.action} тебя. что скажешь`);
    const noEmbed = new EmbedBuilder()
      .setTitle("Отказ")
      .setDescription(`${targetUser}, решил(а) отказаться от предложения <@${authorId}>`);

    const button = new ButtonBuilder().setCustomId(`${targetUserId}_yes`).setLabel("Согласится").setStyle(ButtonStyle.Success);
    const button2 = new ButtonBuilder().setCustomId(`${targetUserId}_no`).setLabel("Отказатся").setStyle(ButtonStyle.Danger);
    const arrow = new ActionRowBuilder().setComponents(button, button2);

    // Если NSFW и не в NSFW-канале, отправляем ошибку
    if (isNsfw && !message.channel.nsfw) {
      await message.reply({ ephemeral: true, embeds: [errorEmbed], ephemeral: true });
      return;
    }

    // Отправляем сообщение с кнопками
    const replyMessage = await message.reply({ embeds: [acceptableEmbed], components: [arrow] });

    // Создаем коллектор для кнопок
    const collector = replyMessage.createMessageComponentCollector({ componentType: ComponentType.Button, time: 15_000 });

    // Обрабатываем нажатия на кнопки
    collector.on("collect", async (inter) => {
      if (inter.customId === `${inter.user.id}_no`) {
        await inter.message.edit({ components: [], embeds: [noEmbed] });
      } else if (inter.customId === `${inter.user.id}_yes`) {
        embed.setDescription(`Пользователь <@${authorId}> ${reactionData.verbal} ${reactionData.memberVerb} ${targetUser}`);
        await inter.message.edit({ components: [], embeds: [embed] });
      }
    });

    // Обрабатываем завершение коллектора (например, из-за истечения времени)
    collector.on("end", (collected, reason) => {
      if (reason && reason !== "time") {
        console.error(`Collector ended due to an error: ${reason}`);
        // Можно обработать ошибку здесь, например, отправить сообщение пользователю или записать в лог.
      } else if (reason === "time") {
        replyMessage.edit({ components: [], embeds: [timeoutEmbed] }).catch(console.error);
      }
    });
  }
}

module.exports = react;
