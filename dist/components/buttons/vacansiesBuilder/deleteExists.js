"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const system_message_1 = require("../../../models/system_message");
const button = {
    customId: "deleteExists",
    /**
     * @param {ButtonInteraction} interaction
    */
    async execute(interaction) {
        const embed = new discord_js_1.EmbedBuilder()
            .setTitle("Установка канала для отправки вакансий")
            .setTimestamp(Date.now())
            .setFooter({ iconURL: interaction.user.displayAvatarURL(), text: interaction.user.username });
        const channel_id = await system_message_1.systemMessageModel.findOneAndDelete({
            where: {
                guild_id: interaction.guildId
            }
        });
        await interaction.message.edit({ embeds: [embed.setDescription(`Ваш канал: отсутствует`)] });
    }
};
exports.default = button;
