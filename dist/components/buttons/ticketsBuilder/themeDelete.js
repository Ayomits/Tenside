"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const button = {
    customId: "themeDelete",
    /**
     * @param {ButtonInteraction} interaction
     */
    async execute(interaction) {
        const modal = new discord_js_1.ModalBuilder()
            .setCustomId("themeDeleteModal")
            .setTitle("Удаление темы");
        const themeId = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.TextInputBuilder()
            .setLabel("Введите айди темы")
            .setCustomId("themeId")
            .setPlaceholder("REPORT")
            .setStyle(discord_js_1.TextInputStyle.Short));
        modal.addComponents(themeId);
        await interaction.showModal(modal);
    }
};
exports.default = button;
