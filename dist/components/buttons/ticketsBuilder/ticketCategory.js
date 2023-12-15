"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const button = {
    customId: "ticketCategory",
    /**
     *@param {ButtonInteraction} interaction
     */
    async execute(interaction) {
        const modal = new discord_js_1.ModalBuilder()
            .setCustomId("ticketCategoryModal")
            .setTitle("Категория тикетов");
        const category_id = new discord_js_1.TextInputBuilder()
            .setCustomId("categoryId")
            .setLabel("Айди категории")
            .setPlaceholder("укажите айди категории!!")
            .setStyle(discord_js_1.TextInputStyle.Short);
        const categoryIdComponent = new discord_js_1.ActionRowBuilder().addComponents(category_id);
        modal.addComponents(categoryIdComponent);
        await interaction.showModal(modal);
    }
};
exports.default = button;
