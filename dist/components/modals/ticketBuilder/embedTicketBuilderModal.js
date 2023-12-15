"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const embedGen_1 = require("../../../functions/embedGen");
const tickets_1 = require("../../../models/tickets");
const button = {
    customId: 'embedTicketBuilderModal',
    /**
     * @param {ModalSubmitInteraction} interaction
     */
    async execute(interaction) {
        await (0, embedGen_1.embedBuilderModalCallback)(interaction, tickets_1.TicketSettingsEmbed);
    }
};
exports.default = button;
