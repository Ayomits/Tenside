"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
module.exports = {
    customId: "themeCreateButton",
    /**
     *@param {ButtonInteraction} interaction
     */
    async execute(interaction) {
        const modal = new discord_js_1.ModalBuilder()
            .setTitle("Создание темы")
            .setCustomId("themeCreateModal");
        const themeTitle = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.TextInputBuilder()
            .setLabel("Название темы")
            .setCustomId("themeTitle")
            .setPlaceholder("Жалоба на юзера")
            .setRequired(true)
            .setStyle(discord_js_1.TextInputStyle.Short));
        const themeDesc = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.TextInputBuilder()
            .setLabel("Описание темы")
            .setCustomId("themeDesc")
            .setPlaceholder("Отправьте жалобу и ...")
            .setRequired(true)
            .setStyle(discord_js_1.TextInputStyle.Paragraph));
        const themeId = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.TextInputBuilder()
            .setLabel("ID темы")
            .setCustomId("themeId")
            .setPlaceholder("report")
            .setRequired(true)
            .setStyle(discord_js_1.TextInputStyle.Short));
        const themePingedRoles = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.TextInputBuilder()
            .setCustomId("pingedRoles")
            .setLabel("Пингуемые роли на тему")
            .setRequired(true)
            .setPlaceholder("айди ролей через пробел!!")
            .setStyle(discord_js_1.TextInputStyle.Short));
        modal.addComponents(themeTitle, themeDesc, themePingedRoles, themeId);
        await interaction.showModal(modal);
    }
};
