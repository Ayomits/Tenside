"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.systemAnketaRecrutChannel = exports.systemAnketaEmbed = exports.systemMessageModel = void 0;
const mongoose_1 = require("mongoose");
const mongoose_2 = require("mongoose");
const systemMessageModelSchema = new mongoose_1.Schema({
    guild_id: {
        type: String,
        required: true
    },
    channel_id: {
        type: String,
        required: true
    }
}); // тут просто схему это определяь
const systemAnketaEmbedSchema = new mongoose_1.Schema({
    guild_id: {
        type: String,
        require: true,
        unique: true
    },
    title: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    color: {
        type: String,
        require: true
    },
    imageLink: {
        type: String,
        require: false
    }
}); // тут просто схему это определяь
const systemAnketaRecrutChannelSchema = new mongoose_1.Schema({
    guild_id: {
        type: String,
        required: true
    },
    channel_id: {
        type: String,
        required: true
    }
});
exports.systemMessageModel = mongoose_2.default.model("SystemMessageModel", systemMessageModelSchema);
exports.systemAnketaEmbed = mongoose_2.default.model("SystemAnketaEmbed", systemAnketaEmbedSchema);
exports.systemAnketaRecrutChannel = mongoose_2.default.model("SystemAnketaRecrutChannel", systemAnketaRecrutChannelSchema);
