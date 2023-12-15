"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.channelModel = void 0;
const mongoose_1 = require("mongoose");
const mongoose_2 = require("mongoose");
const channel = new mongoose_1.Schema({
    guild_id: {
        type: String,
        required: true
    },
    channel_id: {
        type: String,
        required: true,
    },
});
exports.channelModel = mongoose_2.default.model("channels", channel);
