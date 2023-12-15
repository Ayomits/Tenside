"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const users_1 = require("../../models/users");
/**
 * @param {Message} message
 */
const onMessage = {
    name: discord_js_1.Events.MessageCreate,
    once: false,
    /**
     *
     * @param {Message} message
     */
    async execute(message) {
        if (!message.author.bot) {
            if (!message.content.startsWith(process.env.PREFIX || '.')) {
                await users_1.userModel.updateOne({ user_id: message.author.id, guild_id: message.guild?.id }, { $inc: { balance: 2, messageCount: 1 } });
            }
        }
    }
};
exports.default = onMessage;
