"use strict";
const { EmbedBuilder } = require('discord.js');
const { Model } = require("mongoose");
const { CommandInteraction } = require("discord.js");
/**
 *
 * @param {CommandInteraction} interaction
 * @param {Model} model
 * @param {String} system
 */
async function setChannel(interaction, model, system) {
    const values = interaction.values[0];
    const UpdatedRows = await model.updateOne({ guild_id: interaction.guildId }, { channel_id: values }, { upsert: true, new: true });
    let embed = new EmbedBuilder()
        .setTitle(`Настройка ${system}`)
        .setFooter({ iconURL: interaction.user.displayAvatarURL(), text: interaction.user.username })
        .setColor("#2F3136");
    if (UpdatedRows) {
        embed.setDescription(`Ваш канал <#${values}>`);
        await interaction.message.edit({ embeds: [embed] });
        await interaction.reply({ content: `канал для ${system} успешно обновлён в базе данных`, ephemeral: true });
    }
    else {
        await model.create({ guild_id: interaction.guildId, channel_id: values });
        embed.setDescription(`Ваш канал <#${values}>`);
        await interaction.message.edit({ embeds: [embed] });
        await interaction.reply({ content: `канал для ${system} успешно создан в базе данных`, ephemeral: true });
    }
}
module.exports = { setChannel };
