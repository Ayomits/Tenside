"use strict";
const { CommandInteraction, EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { userModel } = require("../../models/users");
const { topTemplate } = require("../../functions/leaderBoardTemplete");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("top")
        .setDescription("Лист пользователей на сервере по деньгам"),
    /**
     * @param {CommandInteraction} interaction
     */
    async execute(interaction) {
        topTemplate(interaction, { balance });
    },
};
