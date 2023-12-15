"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const system_message_1 = require("../../../models/system_message");
const setChannel_1 = require("../../../functions/setChannel");
const button = {
    customId: "setRecrutChannel",
    /**
     * @param {ChannelSelectMenuInteraction} interaction
     */
    async execute(interaction) {
        await (0, setChannel_1.setChannel)(interaction, system_message_1.systemAnketaRecrutChannel, "вакансий");
    }
};
exports.default = button;
