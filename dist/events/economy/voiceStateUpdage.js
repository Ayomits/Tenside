"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const users_1 = require("../../models/users");
function startInterval(userId, guildId, client) {
    if (!client.voiceUsers.has(userId)) {
        const interval = setInterval(async () => {
            await users_1.userModel.updateOne({ guild_id: guildId, user_id: userId }, { $inc: { balance: 5, voiceActive: 60 } });
        }, 60000);
        client.voiceUsers.set(userId, interval);
    }
}
function stopInterval(userId, client) {
    if (client.voiceUsers.has(userId)) {
        clearInterval(client.voiceUsers.get(userId));
        client.voiceUsers.delete(userId);
    }
}
const voiceStateUpdate = {
    name: discord_js_1.Events.VoiceStateUpdate,
    once: false,
    /**
     * @param {VoiceState} oldState
     * @param {VoiceState} newState
     */
    async execute(oldState, newState) {
        const userId = newState.member?.id;
        const guildId = newState.guild.id;
        if (newState.channelId) {
            startInterval(String(userId), guildId, newState.client);
        }
        else {
            stopInterval(String(userId), newState.client);
        }
    },
};
exports.default = voiceStateUpdate;
