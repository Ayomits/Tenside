"use strict";
const { ChannelSelectMenuInteraction, EmbedBuilder } = require("discord.js");
const { TicketSettings } = require("../../../models/tickets");
const { setChannel } = require("../../../functions/setChannel");
module.exports = {
    customId: "setChannelSelect",
    /**
     * @param {ChannelSelectMenuInteraction} interaction
     */
    async execute(interaction) {
        await setChannel(interaction, TicketSettings, "тикетов");
    }
};
