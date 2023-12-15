"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const tickets_1 = require("../../../models/tickets");
const button = {
    customId: "allThemes",
    /**
     * @param {ButtonInteraction} interaction
     */
    async execute(interaction) {
        const embed = new discord_js_1.EmbedBuilder()
            .setTitle("Все темы тикетов");
        let description = "";
        const values = await tickets_1.TicketSettingsTheme.find({ guild_id: interaction.guildId });
        for (const val of values) {
            description += `**Тема**: ${val.theme_uniq_id}\n **Название темы**: ${val.theme_title}\n **Описание темы**: ${val.theme_desc} \n **Уникальный id**: ${val.theme_uniq_id}\n **Пингуемые роли на тему**: ${val.pinged_roles}\n\n`;
        }
        embed.setDescription(description);
        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
};
exports.default = button;
