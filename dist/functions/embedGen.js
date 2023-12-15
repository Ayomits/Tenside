"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.embedBuilderModalCallback = exports.embedBuilderModal = void 0;
const discord_js_1 = require("discord.js");
async function embedBuilderModal(interaction, customId) {
    const modal = new discord_js_1.ModalBuilder()
        .setTitle("Генератор эмбеда")
        .setCustomId(customId);
    const title = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.TextInputBuilder()
        .setCustomId("embedTitle")
        .setLabel("Название эмбеда вакансий")
        .setPlaceholder("Название эмбеда")
        .setRequired(true)
        .setStyle(discord_js_1.TextInputStyle.Short));
    const desc = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.TextInputBuilder()
        .setCustomId("embedDescription")
        .setLabel("Описание эмбеда")
        .setPlaceholder("Бла-бла")
        .setStyle(discord_js_1.TextInputStyle.Paragraph)
        .setRequired(true));
    const color = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.TextInputBuilder()
        .setCustomId("embedColor")
        .setLabel("цвет эмбеда")
        .setPlaceholder("#0000000")
        .setStyle(discord_js_1.TextInputStyle.Short)
        .setRequired(true)
        .setMaxLength(7)
        .setMinLength(7));
    const image = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.TextInputBuilder()
        .setCustomId("embedImage")
        .setLabel("Ссылка на изображение")
        .setPlaceholder("https://example.com")
        .setStyle(discord_js_1.TextInputStyle.Short)
        .setRequired(false));
    modal.setComponents(title, desc, color, image);
    await interaction.showModal(modal);
}
exports.embedBuilderModal = embedBuilderModal;
async function embedBuilderModalCallback(interaction, model) {
    const embedTitle = interaction.fields.getTextInputValue("embedTitle");
    const embedDescription = interaction.fields.getTextInputValue('embedDescription');
    const embedImage = interaction.fields.getTextInputValue('embedImage');
    const embedColor = interaction.fields.getTextInputValue('embedColor');
    const filter = { guild_id: interaction.guildId };
    const update = {
        title: embedTitle,
        description: embedDescription,
        color: embedColor,
        imageLink: embedImage || "https://i.pinimg.com/736x/95/15/52/951552282c98f65fa63723fc75d361e8.jpg"
    };
    const updated = await model.updateOne(filter, update, { new: true, upsert: true });
    if (!updated) {
        await model.create({
            guild_id: interaction.guildId,
            title: embedTitle,
            description: embedDescription,
            color: embedColor,
            imageLink: embedImage ? embedImage != null : "https://i.pinimg.com/736x/95/15/52/951552282c98f65fa63723fc75d361e8.jpg"
        }).then(async () => {
            await interaction.reply({ content: "успешно создан эмбед", ephemeral: true });
        });
    }
    else {
        await interaction.reply({ content: "успешно обновлён эмбед", ephemeral: true });
    }
}
exports.embedBuilderModalCallback = embedBuilderModalCallback;
