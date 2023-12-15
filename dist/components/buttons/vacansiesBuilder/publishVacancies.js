"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const system_message_1 = require("../../../models/system_message");
function descTemplate(vacansiya) {
    return "Вы хотите подать на " + vacansiya;
}
const button = {
    customId: "publishVacancies",
    /**
     * @param {ButtonInteraction} interaction
     */
    async execute(interaction) {
        const channel_id = await system_message_1.systemMessageModel.findOne({
            guild_id: interaction.guildId,
        });
        if (channel_id) {
            const channelId = channel_id.channel_id;
            const channel = interaction.guild?.channels?.cache.get(channelId);
            const fields = await system_message_1.systemAnketaEmbed.findOne({ guild_id: interaction.guildId });
            if (fields) {
                const embed1 = new discord_js_1.EmbedBuilder()
                    .setImage(fields.imageLink)
                    .setColor(fields.color);
                const embed2 = new discord_js_1.EmbedBuilder()
                    .setTitle(fields.title)
                    .setDescription(fields.description)
                    .setColor(fields.color);
                const select = new discord_js_1.StringSelectMenuBuilder()
                    .setCustomId("vacansiesSelect")
                    .setPlaceholder("Выберите должность")
                    .setOptions({ label: "Ведущий", value: "vedushiy", description: descTemplate("ведущий") }, { label: "Closer", value: "closer", description: descTemplate("closer") }, { label: "Creative", value: "creative", description: descTemplate("creative") }, { label: "Control", value: "control", description: descTemplate("control") }, { label: "Eventer", value: "eventer", description: descTemplate("eventer") }, { label: "PR manager", value: "pm", description: descTemplate("пиар менеджера") }, { label: "Designer", value: "designer", description: descTemplate("designer") }, { label: "Media", value: "media", description: descTemplate("media") }, { label: "Support", value: "support", description: descTemplate("support") });
                try {
                    await channel.send({
                        components: [new discord_js_1.ActionRowBuilder().addComponents(select)],
                        embeds: [embed1, embed2]
                    });
                }
                catch {
                    await interaction.reply({
                        content: "неизвестная ошибка undefined",
                        ephemeral: true
                    });
                }
            }
            else {
                await interaction.reply({ content: "Не установлен эмбед. Обратите внимание, в поле image нужно ставить картинку, а не pornhub!!", ephemeral: true });
            }
        }
    },
};
exports.default = button;
