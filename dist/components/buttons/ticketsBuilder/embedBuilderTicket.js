"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const embedGen_1 = require("../../../functions/embedGen");
const button = {
    customId: "embedBuilderTicket",
    /**
     * @param {ButtonInteraction} interaction
     */
    async execute(interaction) {
        await (0, embedGen_1.embedBuilderModal)(interaction, "embedTicketBuilderModal");
    },
};
exports.default = button;
