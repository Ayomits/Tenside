"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const env = require("dotenv");
const mongoose = require("mongoose");
const eventHandler_1 = require("./handlers/system/eventHandler");
env.config();
const intents = [
    discord_js_1.GatewayIntentBits.Guilds,
    discord_js_1.GatewayIntentBits.DirectMessages,
    discord_js_1.GatewayIntentBits.GuildMembers,
    discord_js_1.GatewayIntentBits.GuildMessages,
    discord_js_1.GatewayIntentBits.MessageContent,
    discord_js_1.GatewayIntentBits.GuildVoiceStates,
];
const client = new discord_js_1.Client({ intents: intents });
client.commands = new discord_js_1.Collection();
client.buttons = new discord_js_1.Collection();
client.voiceUsers = new discord_js_1.Collection();
mongoose.connect(process.env.DB_URI || 'mongodb://127.0.0.1/TensideLocal');
(0, eventHandler_1.eventHandler)(client);
client.on('error', (error) => console.log(error));
client.on('warn', (warn) => console.log(warn));
client.login(process.env.TOKEN || "hello world");
