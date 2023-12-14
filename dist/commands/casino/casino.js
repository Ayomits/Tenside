"use strict";
const { CommandInteraction, EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { userModel } = require("../../models/users");
const { casinoModel } = require("../../models/casino");
const waitimg = "https://media.discordapp.net/attachments/1173982744053829692/1183445733655990333/941dcf16849f26501923469dd119db15.gif?ex=65885cba&is=6575e7ba&hm=af980cc489071ee8140e5a57accff10c7738abe65ec1f48a6e240b01b42aec31&=";
const images = [
    `https://media.discordapp.net/attachments/1173982744053829692/1183446320833368104/b6e45f1f2c49db8863d8af168e6e71f6.gif?ex=65885d46&is=6575e846&hm=281bf26e5944938609aa1fddeef3092ba9f71a85895a56bc6cd7f9222d458738&=`,
    `https://media.discordapp.net/attachments/1173982744053829692/1183446178000543844/7a9d12693ca06813df5f922c786b5c54.gif?ex=65885d24&is=6575e824&hm=96c517c9087b7346223e5151ce1ef1d6cd63d3fc29daef7e47858af2a5886f18&=`,
];
const random = (arr) => arr[Math.floor(Math.random() * arr.length)];
const loseimg = "https://media.discordapp.net/attachments/1173982744053829692/1183448383436894361/0c9499d86e30b5243a612b5d61b0e6a6.gif?ex=65885f32&is=6575ea32&hm=beb39312487578da6adbde7f5091683c6d065480811d5da28194f61d69c8e16c&=";
/**
 * @param {CommandInteraction} interaction
 */
module.exports = {
    data: new SlashCommandBuilder()
        .setName("casino")
        .setDescription("Игра в казино!")
        .addIntegerOption((option) => option.setName("bid").setDescription("Ваша ставка").setRequired(true))
        .addStringOption((option) => option
        .setName("color")
        .setDescription("Выберите цвет")
        .setRequired(true)
        .addChoices({ name: "Черное", value: "черное" }, { name: "Красное", value: "красное" }, { name: "Зеленое", value: "зеленое" })),
    async execute(interaction) {
        const selectedImage = random(images);
        const bid = interaction.options.getInteger("bid");
        const casinobalance = await casinoModel.findOne({
            guild_id: interaction.guild.id,
        });
        const intUser = await userModel.findOne({
            guild_id: interaction.guild.id,
            user_id: interaction.user.id,
        });
        if (!casinobalance)
            await casinoModel.create({ guild_id: interaction.guild.id });
        const casinobal = await casinoModel.findOne({
            guild_id: interaction.guild.id,
        });
        if (casinobal.balance < bid) {
            return await interaction.reply({
                ephemeral: true,
                content: `Ваша ставка превышает баланс казино! обратитетсь к Kleyy`,
            });
        }
        const balanceEmbed = new EmbedBuilder()
            .setTitle(`Ошибка!`)
            .setDescription(`**❌ У вас недостаточно валюты на счету. Ваш баланс:** \`${intUser ? intUser.balance : 0}\` <:solana:1183097799756238858> ❌`)
            .setColor("#db2518")
            .setFooter({
            iconURL: interaction.user.avatarURL(),
            text: interaction.user.username,
        });
        if (intUser.balance < bid) {
            return await interaction.reply({
                embeds: [balanceEmbed],
                ephemeral: true,
            });
        }
        const waitEmbed = new EmbedBuilder()
            .setTitle(`Рулетка крутится...`)
            .setDescription(`Ожидайте.... Рулетка крутится...`)
            .setImage(waitimg);
        await interaction.reply({ embeds: [waitEmbed] });
        setTimeout(async () => {
            const selectedColor = interaction.options.getString("color");
            const colors = ["черное", "красное", "зеленое"];
            const number = Math.floor(Math.random() * colors.length);
            const color = colors[number];
            const winmoney = color === "зеленое" ? bid * 2 : bid * 1.5;
            const winEmbed = new EmbedBuilder()
                .setImage(selectedImage)
                .setTitle(`Поздравляю, вы выиграли!`)
                .setDescription(`🎉 **На табло ${color}. Ваша ставка умножается на ${color === "зеленое" ? "2" : "1.5"}. Вы выиграли** \`${Math.floor(winmoney)}\` **<:solana:1183097799756238858>**`)
                .setColor("#3ab03c")
                .setThumbnail(color === "черное"
                ? "https://imgur.com/xR0bhFd.png" // Замените ссылку на изображение черного цвета
                : color === "красное"
                    ? "https://imgur.com/98z8yxs.png" // Замените ссылку на изображение красного цвета
                    : "https://imgur.com/yRTaaMX.png" // Замените ссылку на изображение зеленого цвета
            )
                .setFooter({
                iconURL: interaction.user.avatarURL(),
                text: interaction.user.username,
            })
                .setTimestamp(Date.now());
            const loseEmbed = new EmbedBuilder()
                .setTitle(`Увы, вы проиграли!`)
                .setDescription(`💔 **На табло ${color}. Вы проиграли** \`${bid}\` **<:solana:1183097799756238858> **`)
                .setColor("#a8342d")
                .setImage(loseimg)
                .setThumbnail(color === "черное"
                ? "https://imgur.com/xR0bhFd.png" // Замените ссылку на изображение черного цвета
                : color === "красное"
                    ? "https://imgur.com/98z8yxs.png" // Замените ссылку на изображение красного цвета
                    : "https://imgur.com/yRTaaMX.png" // Замените ссылку на изображение зеленого цвета
            )
                .setFooter({
                iconURL: interaction.user.avatarURL(),
                text: interaction.user.username,
            })
                .setTimestamp(new Date());
            if (color === selectedColor) {
                if (selectedColor == `красное` || selectedColor == `черное`) {
                    await this.update(interaction, -Math.floor(bid * 1.5), Math.floor(bid * 1.5));
                    await interaction.editReply({ embeds: [winEmbed] });
                }
                else
                    await interaction.editReply({ embeds: [winEmbed] });
            }
            else {
                await this.update(interaction, Math.floor(bid), -Math.floor(bid));
                await interaction.editReply({ embeds: [loseEmbed] });
            }
        }, 5000);
    },
    async update(interaction, casinoAmount, userAmount) {
        await casinoModel.updateOne({
            guild_id: interaction.guild.id,
        }, {
            $inc: { balance: casinoAmount },
        });
        await userModel.updateOne({
            guild_id: interaction.guild.id,
            user_id: interaction.user.id,
        }, { $inc: { balance: userAmount } });
    },
};
