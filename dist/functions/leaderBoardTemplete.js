"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.topTemplate = void 0;
const users_1 = require("../models/users");
async function topTemplate(interaction) {
    const devs = JSON.parse(process.env.DEVELOPERS || "['1129162686194790572']");
    const users = await users_1.userModel
        .find({ guild_id: interaction.guildId, user_id: { $nin: devs } })
        .sort({ balance: -1 })
        .limit(10);
    let description = "";
    let count = 1;
    for (let user of users) {
        description += `**#${count}.** <@${user.user_id}> - \`${user.balance}\` <:solana:1183097799756238858>\n\n`;
        count += 1;
    }
    const embed = new EmbedBuilder()
        .setTitle(`Топ 10 по деньгам сервера ${interaction.guild?.name}`)
        .setDescription(description)
        .setColor('#bdb022')
        .setFooter({
        iconURL: interaction.user.avatarURL(),
        text: interaction.user.username,
    });
    await interaction.reply({ embeds: [embed] });
}
exports.topTemplate = topTemplate;
