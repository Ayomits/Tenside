"use strict";
const { Schema } = require("mongoose");
const mongoose = require("mongoose");
const channel = new Schema({
    guild_id: {
        type: String,
        required: true
    },
    channel_id: {
        type: String,
        required: true,
    },
});
const channelModel = mongoose.model("channels", channel);
module.exports = {
    channelModel
};
