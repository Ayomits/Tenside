"use strict";
const { embedBuilderModalCallback } = require("../../../functions/embedGen");
const { TicketSettingsEmbed } = require("../../../models/tickets");
const { ModalSubmitInteraction } = require("discord.js");
module.exports = {
    customId: 'embedTicketBuilderModal',
    /**
     * @param {ModalSubmitInteraction} interaction
     */
    async execute(interaction) {
        await embedBuilderModalCallback(interaction, TicketSettingsEmbed);
    }
};
