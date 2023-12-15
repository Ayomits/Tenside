"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseCallback = exports.baseModal = void 0;
const discord_js_1 = require("discord.js");
const system_message_1 = require("../models/system_message");
const baseModal = async (customId, question1, question2, placeholder1, placeholder2, interaction) => {
    const modal = new discord_js_1.ModalBuilder()
        .setTitle("Заявка в стафф")
        .setCustomId(customId);
    const aboutName = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.TextInputBuilder()
        .setLabel("Ваше имя, возраст?")
        .setCustomId("Ваше имя, возраст?")
        .setRequired(true)
        .setPlaceholder("Ален 18 лет")
        .setStyle(discord_js_1.TextInputStyle.Short));
    const aboutExperience = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.TextInputBuilder()
        .setLabel("Был ли опыт на этой должности")
        .setCustomId("Был ли опыт на этой должности")
        .setRequired(true)
        .setPlaceholder("2 года на проекте..")
        .setStyle(discord_js_1.TextInputStyle.Short));
    const whyYou = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.TextInputBuilder()
        .setCustomId("Почему именно вы?")
        .setLabel("Почему именно вы?")
        .setPlaceholder("Потому что я Ален...")
        .setRequired(true)
        .setStyle(discord_js_1.TextInputStyle.Paragraph));
    const question1_ = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.TextInputBuilder()
        .setCustomId(question1)
        .setLabel(question1)
        .setStyle(discord_js_1.TextInputStyle.Paragraph)
        .setRequired(true)
        .setPlaceholder(placeholder1));
    const question2_ = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.TextInputBuilder()
        .setCustomId(question2)
        .setLabel(question2)
        .setStyle(discord_js_1.TextInputStyle.Paragraph)
        .setRequired(true)
        .setPlaceholder(placeholder2));
    modal.addComponents(aboutExperience, aboutName, whyYou, question1_, question2_);
    await interaction.showModal(modal);
};
exports.baseModal = baseModal;
/**
 *
 * @param {ModalSubmitInteraction} interaction
 */
const baseCallback = async (interaction) => {
    const embed = new discord_js_1.EmbedBuilder().setTitle(`Вакансия от ${interaction.user.username} на должность ${interaction.customId}`);
    const fields = interaction.fields.fields;
    let description = ``;
    for (let field of fields) {
        const inputForm = field[1];
        description += `### **${inputForm.customId}**` + "```" + `${inputForm.value}` + "```\n";
    }
    embed.setDescription(description);
    embed.setFooter({ iconURL: interaction.user.displayAvatarURL(), text: interaction.user.username });
    embed.setColor("#2F3136");
    embed.setTimestamp(Date.now());
    await system_message_1.systemAnketaRecrutChannel
        .findOne({ guild_id: interaction.guildId })
        .then(async (result) => {
        const channel = interaction.client.channels.cache.get(result.channel_id);
        await interaction.reply({ content: "Ваша заявка успешно отправлена. Администрация её рассмотрит и отправит вам ответ!", ephemeral: true });
        await channel.send({ embeds: [embed] });
    });
};
exports.baseCallback = baseCallback;
