"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.react = exports.acceptable = void 0;
const discord_js_1 = require("discord.js");
const fs = require("fs");
const path = require("path");
async function acceptable(message, embed, targetUser, authorId, reactionData, timeoutEmbed) {
    const targetUserId = targetUser.id;
    const acceptableEmbed = new discord_js_1.EmbedBuilder()
        .setTitle(`Реакция: ${reactionData.action.toLowerCase()}`)
        .setDescription(`Эй, ${targetUser}, тебя тут <@${authorId}> хочет ${reactionData.action.toLowerCase()}, что скажешь?`)
        .setFooter({
        iconURL: message.author.displayAvatarURL(),
        text: message.author.username
    });
    const noEmbed = new discord_js_1.EmbedBuilder()
        .setTitle(`Реакция: ${reactionData.action.toLowerCase()}`)
        .setDescription(`${targetUser}, решил(а) отказаться от предложения <@${authorId}>`);
    const button = new discord_js_1.ButtonBuilder()
        .setCustomId(`${targetUserId}_yes`)
        .setEmoji("✅")
        .setStyle(discord_js_1.ButtonStyle.Secondary);
    const button2 = new discord_js_1.ButtonBuilder()
        .setCustomId(`${targetUserId}_no`)
        .setEmoji("❌")
        .setStyle(discord_js_1.ButtonStyle.Secondary);
    const arrow = new discord_js_1.ActionRowBuilder().setComponents(button, button2);
    const replyMessage = await message.reply({
        embeds: [acceptableEmbed],
        components: [arrow],
    });
    // Создаем коллектор для кнопок
    const collector = replyMessage.createMessageComponentCollector({
        componentType: discord_js_1.ComponentType.Button,
        time: 15000,
    });
    let isClicked = false;
    // Обрабатываем нажатия на кнопки
    collector.once("collect", async (inter) => {
        if (inter.customId === `${inter.user.id}_no`) {
            await inter.message.edit({ components: [], embeds: [noEmbed] });
            isClicked = true;
        }
        else if (inter.customId === `${inter.user.id}_yes`) {
            embed.setDescription(`Пользователь <@${authorId}> ${reactionData.verbal} ${reactionData.memberVerb} ${targetUser}`);
            await inter.message.edit({ components: [], embeds: [embed] });
            isClicked = true;
        }
    });
    // Обрабатываем завершение коллектора (например, из-за истечения времени)
    collector.once("end", (collected, reason) => {
        if (!isClicked) {
            if (reason && reason !== "time") {
                console.error(`Collector ended due to an error: ${reason}`);
                // Можно обработать ошибку здесь, например, отправить сообщение пользователю или записать в лог.
            }
            else if (reason === "time") {
                replyMessage
                    .edit({ components: [], embeds: [timeoutEmbed] })
                    .catch(console.error);
            }
        }
        else {
            return;
        }
    });
}
exports.acceptable = acceptable;
async function react(message, reaction, url) {
    const baseDir = path.resolve("configs");
    const reactionsData = JSON.parse(await fs.promises.readFile(path.join(baseDir, "reactions.json"), "utf-8"));
    const reactionData = reactionsData[reaction];
    if (!reactionData) {
        throw new Error("Я такого не знать");
    }
    const authorId = message.author.id;
    const mentions = message.mentions;
    const targetUser = mentions?.users.first();
    const action = reactionData.action;
    const embed = new discord_js_1.EmbedBuilder()
        .setTitle(`Реакция: ${action.toLowerCase()}`)
        .setImage(url)
        .setFooter({
        iconURL: message.author.displayAvatarURL(),
        text: message.author.username,
    })
        .setTimestamp(Date.now())
        .setColor("#2F3136");
    const botErrorEmbed = new discord_js_1.EmbedBuilder()
        .setTitle("Ошибка")
        .setDescription("Я тоже считаю, что боты живые, но может быть ты выберешь пользователя?")
        .setColor("#2F3136");
    const authorErrorEmbed = new discord_js_1.EmbedBuilder()
        .setTitle("Ошибка")
        .setDescription("Тебе так одиноко? Понимаю, но всё же, выбери другого пользователя, а не себя!")
        .setColor("#2F3136");
    const timeoutEmbed = new discord_js_1.EmbedBuilder()
        .setTitle("Время вышло")
        .setDescription(`Время для реакции истекло.`)
        .setColor("#2F3136");
    const isEveryoneReaction = reactionData.everyone;
    const isAcceptable = reactionData.isAcceptable;
    const isNsfw = reactionData.nsfw;
    if (!isNsfw) {
        if (isEveryoneReaction === false && targetUser) {
            if (message.author === targetUser) {
                return message.reply({ embeds: [authorErrorEmbed] });
            }
            else if (targetUser.bot) {
                return message.reply({ embeds: [botErrorEmbed] });
            }
            else if (isAcceptable) {
                await acceptable(message, embed, targetUser, authorId, reactionData, timeoutEmbed);
            }
        }
        else {
            if (targetUser && authorId !== targetUser.id && !targetUser.bot) {
                embed.setDescription(`Пользователь <@${authorId}> ${reactionData.verbal.toLowerCase()} ${reactionData.memberVerb.toLowerCase()} ${targetUser}`);
            }
            else {
                embed.setDescription(`Пользователь <@${authorId}> ${reactionData.verbal.toLowerCase()} ${reactionData.everyoneVerb.toLowerCase()}`);
            }
            await message.reply({ embeds: [embed] });
        }
    }
}
exports.react = react;
exports.default = { react };
