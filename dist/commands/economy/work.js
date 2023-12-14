"use strict";
const { CommandInteraction, EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const fs = require("fs");
const path = require("path");
const { userModel } = require("../../models/users");
const { workModel } = require("../../models/users");
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}
async function giveMoney(interaction, money) {
    await userModel.updateOne({ guild_id: interaction.guildId,
        user_id: interaction.user.id }, { $inc: { balance: money } });
    return money;
}
async function sendWorkData(interaction, worktime) {
    const configs = path.resolve("configs");
    const worklist = JSON.parse(await fs.promises.readFile(configs + "/work.json"));
    let workdata = [];
    for (let key in worklist.works[0]) {
        workdata.push(key);
    }
    const num = Math.floor(Math.random() * workdata.length);
    const neededwork = workdata[num];
    // const presnum = Math.floor(Math.random() * 100)
    const presnum = 1;
    const description = presnum < worklist.works[0][neededwork].prestige_chance ? worklist.works[0][neededwork].prestige_description : worklist.works[0][neededwork].default_description;
    const payment = (description == worklist.works[0][neededwork].prestige_description ? worklist.works[0][neededwork].prestige_pay : worklist.works[0][neededwork].default_pay) + presnum;
    const workname = worklist.works[0][neededwork].user_name;
    const gif = worklist.works[0][neededwork].gif;
    const color = worklist.works[0][neededwork].color;
    const emoji = worklist.works[0][neededwork].emoji;
    const workEmbed = new EmbedBuilder()
        .setTitle(`${emoji} Работа`)
        .setDescription(`**<@${interaction.user.id}>, вы работали ${workname}. ${description} Вам заплатили ${payment} <:solana:1183097799756238858>**`)
        .setImage(gif)
        .setColor(color);
    await interaction.editReply({ embeds: [workEmbed] });
    newMoney = await giveMoney(interaction, payment);
}
module.exports = {
    data: new SlashCommandBuilder()
        .setName("work")
        .setDescription("Работать"),
    /**
     * @param {CommandInteraction} interaction
     */
    async execute(interaction) {
        await userModel.findOne({
            guild_id: interaction.guildId,
            user_id: interaction.user.id,
        });
        const embed = new EmbedBuilder()
            .setTitle(`⚒️ Работа`)
            .setImage("https://i.pinimg.com/originals/ab/e5/57/abe557b5780fc93e83447ac60987d000.gif");
        const worktime = await workModel.findOne({
            guild_id: interaction.guildId,
            user_id: interaction.user.id,
        });
        let now = Date.now();
        if (worktime) {
            let nextWorkTimestamp = new Date(worktime.next_work).getTime();
            console.log(nextWorkTimestamp);
            if (nextWorkTimestamp > now) {
                embed.setTitle("Ошибка!");
                embed.setDescription(`**❌ Вы уже работали менее, чем 2 часа назад! Отдохните. Трудоголизм - это так себе...**`);
                embed.setColor('#ad1f22');
                await interaction.reply({ embeds: [embed], ephemeral: true });
                return 0;
            }
            else {
                await workModel.updateOne({ guild_id: interaction.guildId,
                    user_id: interaction.user.id }, { $set: { next_work: String(Number(Date.now()) + 7200) } });
                await interaction.reply({ embeds: [embed.setDescription(`**<@${interaction.user.id}>, вы начали работать. Подождите немного!**`)] });
                setTimeout(sendWorkData, 15000, interaction, worktime);
            }
        }
        else {
            await workModel.create({
                guild_id: interaction.guildId,
                user_id: interaction.user.id,
                next_work: String(Number(Date.now()) + 7200)
            });
        }
    }
};
