"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tickets_1 = require("../../../models/tickets");
const setChannel_1 = require("../../../functions/setChannel");
const button = {
    customId: "setChannelSelect",
    /**
     * @param {ChannelSelectMenuInteraction} interaction
     */
    async execute(interaction) {
        await (0, setChannel_1.setChannel)(interaction, tickets_1.TicketSettings, "тикетов");
    }
};
exports.default = button;
