"use strict";
const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, EmbedBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelSelectMenuBuilder, ChannelType, ComponentType } = require("discord.js");
const { TicketSettings, TicketCategory } = require("../../models/tickets");
const getChannel = require("../../functions/getChannel");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("setupticket")
        .setDescription("настройки тикетов")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    /**
     *
     * @param {CommandInteraction} interaction
     */
    async execute(interaction) {
        let channelId = await getChannel(TicketSettings, interaction);
        const embed = new EmbedBuilder()
            .setTitle("Настройки тикетов")
            .setDescription(`Ваш канал: <#${channelId}>`)
            .setFooter({ iconURL: interaction.user.displayAvatarURL(), text: interaction.user.username })
            .setColor("#2F3136");
        const setChannelSelect = new ActionRowBuilder().addComponents(new ChannelSelectMenuBuilder()
            .setChannelTypes(ChannelType.GuildText)
            .setCustomId("setChannelSelect")
            .setPlaceholder("канал с тикетами"));
        const ticketLogs = new ActionRowBuilder().addComponents(new ChannelSelectMenuBuilder()
            .setChannelTypes(ChannelType.GuildText)
            .setCustomId("setChannelTicketLogs")
            .setPlaceholder("канал с тикет-логами"));
        const settings = new ActionRowBuilder().addComponents(new ButtonBuilder()
            .setCustomId("publishTickets")
            .setLabel("Опубликовать тикеты")
            .setStyle(ButtonStyle.Success), new ButtonBuilder("embedBuilderTicket")
            .setCustomId("embedBuilderTicket")
            .setLabel("Установить эмбед")
            .setStyle(ButtonStyle.Success), new ButtonBuilder()
            .setCustomId("ticketCategory")
            .setLabel("Категория для тикетов")
            .setStyle(ButtonStyle.Success));
        const themes = new ActionRowBuilder().addComponents(new ButtonBuilder()
            .setCustomId("themeCreateButton")
            .setLabel("Создать тему")
            .setStyle(ButtonStyle.Success), new ButtonBuilder()
            .setCustomId("themeDelete")
            .setLabel("Удаление темы")
            .setStyle(ButtonStyle.Danger), new ButtonBuilder()
            .setCustomId("allThemes")
            .setLabel("Просмотреть все темы")
            .setStyle(ButtonStyle.Primary));
        await interaction.reply({ embeds: [embed], components: [setChannelSelect, ticketLogs, settings, themes] });
    }
};
