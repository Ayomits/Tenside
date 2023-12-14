"use strict";
const { CommandInteraction, Client } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const devs = JSON.parse(process.env.DEVELOPERS);
module.exports = {
    data: new SlashCommandBuilder()
        .setName("reload")
        .setDescription("Проверка задержи бота")
        .setDMPermission(true)
        .addStringOption((option) => option
        .setName("type")
        .setDescription("тип перезагружаемого")
        .addChoices({ name: "events", value: "events" }, { name: "commands", value: "commands" }, { name: "components", value: "components" })
        .setRequired(true)),
    /**
     *
     * @param {CommandInteraction} interaction
     *
     */
    async execute(interaction) {
    }
};
