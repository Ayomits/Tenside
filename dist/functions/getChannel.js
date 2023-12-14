"use strict";
module.exports = async (model, interaction) => {
    let channelId = "";
    await model.findOne({ guild_id: interaction.guildId }).then(async (result) => {
        channelId = result.channel_id;
    }).catch(() => {
        channelId = "отсутствует";
    });
    return channelId;
};
