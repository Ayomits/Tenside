"use strict";
const { embedBuilderModalCallback } = require("../../../functions/embedGen");
const { systemAnketaEmbed } = require("../../../models/system_message");
const { ModalSubmitInteraction } = require("discord.js");
module.exports = {
    customId: 'embedGenerator',
    /**
     * @param {ModalSubmitInteraction} interaction
     */
    async execute(interaction) {
        await embedBuilderModalCallback(interaction, systemAnketaEmbed);
    }
};
