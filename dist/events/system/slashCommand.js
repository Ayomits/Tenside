"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slashCommand = void 0;
const discord_js_1 = require("discord.js");
exports.slashCommand = {
    name: discord_js_1.Events.InteractionCreate,
    once: false,
    /**
      * @param {Interaction} CommandInteraction
      */
    async execute(interaction) {
        const command = interaction.client.commands.get(interaction.commandName);
        if (!command)
            return;
        try {
            await command.execute(interaction);
        }
        catch (err) {
            console.log(err);
        }
    }
};
