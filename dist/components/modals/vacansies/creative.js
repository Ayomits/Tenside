"use strict";
const { ModalSubmitInteraction, EmbedBuilder } = require('discord.js');
const { baseCallback } = require("../../../functions/baseExecute");
module.exports = {
    customId: 'creative',
    /**
     * @param {ModalSubmitInteraction} interaction
     */
    async execute(interaction) {
        await baseCallback(interaction);
    },
};
