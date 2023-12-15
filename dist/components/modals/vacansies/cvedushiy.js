"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseExecute_1 = require("../../../functions/baseExecute");
const button = {
    customId: 'closer',
    /**
     * @param {ModalSubmitInteraction} interaction
     */
    async execute(interaction) {
        await (0, baseExecute_1.baseCallback)(interaction);
    },
};
exports.default = button;
