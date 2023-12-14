"use strict";
const { Schema } = require("mongoose");
const mongoose = require("mongoose");
const casinoSchema = new Schema({
    guild_id: {
        type: String,
        required: true
    },
    balance: {
        type: Number,
        default: 500000,
    },
});
const casinoModel = mongoose.model("casino", casinoSchema);
module.exports = {
    casinoModel
};
