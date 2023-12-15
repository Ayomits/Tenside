"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const builders_1 = require("@discordjs/builders");
const casino_1 = require("../../models/casino");
const command = {
    data: new builders_1.SlashCommandBuilder()
        .setName("casinobalance")
        .setDescription("проверка баланса казино"),
    /**
     * @param {CommandInteraction} interaction
     */
    async execute(interaction) {
        const embed = new discord_js_1.EmbedBuilder().setTitle(`Баланс казино - ${interaction.guild?.name}`);
        const balance = await casino_1.casinoModel.findOne({ guild_id: interaction.guild?.id });
        let description = "";
        if (balance) {
            description = `Баланс: \n` + "```" + `${Math.floor(balance.balance)}` + "```";
        }
        else {
            const newbalance = await casino_1.casinoModel.create({ guild_id: interaction.guild?.id });
            description = `Баланс: \n` + "```" + `${Math.floor(newbalance.balance)}` + "```";
        }
        await interaction.reply({ embeds: [embed.setDescription(description).setThumbnail(interaction.guild?.icon ? interaction.guild?.iconURL() : "https://desu.shikimori.one/uploads/poster/characters/119413/main_alt-b5e67a0983c746c2171da4eb7d5c14b1.jpeg")] });
    },
};
exports.default = command;
