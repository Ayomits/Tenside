"use strict";
const { ChannelSelectMenuInteraction } = require("discord.js");
const { TicketLogSettings } = require("../../../models/tickets");
const { setChannel } = require("../../../functions/setChannel");
module.exports = {
    customId: "setChannelTicketLogs",
    /**
     * @param {ChannelSelectMenuInteraction} interaction
     */
    async execute(interaction) {
        await setChannel(interaction, TicketLogSettings, "тикет-логов");
    }
};
