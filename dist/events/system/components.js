"use strict";
const { Interaction, Client, Events } = require("discord.js");
module.exports = {
    name: Events.InteractionCreate,
    once: false,
    /**
     * @param {Interaction} interaction
     * @param {Client} client
     */
    async execute(interaction) {
        if (interaction.isButton()) {
            const button = interaction.client.buttons.get(interaction.customId);
            if (!button)
                return;
            else {
                try {
                    await button.execute(interaction);
                }
                catch {
                    console.error("ошибка кнопки");
                }
            }
        }
        if (interaction.isModalSubmit()) {
            const modal = interaction.client.buttons.get(interaction.customId);
            if (!modal)
                return;
            else {
                try {
                    await modal.execute(interaction);
                }
                catch {
                    console.error("ошибка кнопки");
                }
            }
        }
        if (interaction.isAnySelectMenu()) {
            const select = interaction.client.buttons.get(interaction.customId);
            if (!select)
                return;
            else {
                try {
                    await select.execute(interaction);
                }
                catch {
                    console.error("ошибка кнопки");
                }
            }
        }
    },
};
