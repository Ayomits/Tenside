"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const tickets_1 = require("../../../models/tickets");
const button = {
    customId: "publishTickets",
    /**
     * @param {StringSelectMenuInteraction} interaction
     */
    async execute(interaction) {
        let channelId;
        await tickets_1.TicketSettings.findOne({ guild_id: interaction.guildId }).then((result) => {
            channelId = result.channel_id;
        }).catch(() => {
            console.log(channelId);
            interaction.reply({ content: "что-то пошло не так... Не указан канал публикации", ephemeral: true });
        });
        await tickets_1.TicketLogSettings.findOne({ guild_id: interaction.guildId }).then(async () => {
            await tickets_1.TicketSettingsEmbed.findOne({ guild_id: interaction.guildId }).then(async (fields) => {
                const channel = interaction.client.channels.cache.get(channelId);
                const embed = new discord_js_1.EmbedBuilder()
                    .setTitle(fields.title)
                    .setDescription(fields.description)
                    .setTimestamp(Date.now());
                const ticketCreate = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
                    .setCustomId("ticketCreate")
                    .setLabel("Создать тикет")
                    .setStyle(discord_js_1.ButtonStyle.Success));
                await channel.send({ embeds: [embed], components: [ticketCreate] });
                await interaction.reply({ content: "всё успешно отправлено", ephemeral: true });
            });
        }).catch((err) => {
            console.log(err);
            interaction.reply({ content: "Вы что-то забыли\n" + err, ephemeral: true });
        });
    }
};
exports.default = button;
