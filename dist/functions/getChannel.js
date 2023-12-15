"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChannel = void 0;
const getChannel = async (model, interaction) => {
    let channelId = "";
    await model.findOne({ guild_id: interaction.guildId }).then(async (result) => {
        channelId = result.channel_id;
    }).catch(() => {
        channelId = "отсутствует";
    });
    return channelId;
};
exports.getChannel = getChannel;
