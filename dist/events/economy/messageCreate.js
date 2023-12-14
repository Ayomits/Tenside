"use strict";
const { Events, Message } = require("discord.js");
const { userModel } = require('../../models/users');
/**
 * @param {Message} message
 */
module.exports = {
    name: Events.MessageCreate,
    once: false,
    /**
     *
     * @param {Message} message
     */
    async execute(message) {
        if (!message.author.bot) {
            if (!message.content.startsWith(process.env.PREFIX)) {
                await userModel.updateOne({ user_id: message.author.id, guild_id: message.guild.id }, { $inc: { balance: 2, messageCount: 1 } });
            }
        }
    }
};
