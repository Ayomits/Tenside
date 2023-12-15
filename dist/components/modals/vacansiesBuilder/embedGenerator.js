"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const embedGen_1 = require("../../../functions/embedGen");
const system_message_1 = require("../../../models/system_message");
const button = {
    customId: 'embedGenerator',
    /**
     * @param {ModalSubmitInteraction} interaction
     */
    async execute(interaction) {
        await (0, embedGen_1.embedBuilderModalCallback)(interaction, system_message_1.systemAnketaEmbed);
    }
};
exports.default = button;
