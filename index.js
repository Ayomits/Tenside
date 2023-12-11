const { Client, GatewayIntentBits, Collection } = require("discord.js");
const env = require('dotenv')
const moongoose = require('mongoose')

env.config()

const intents = [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.DirectMessages,
  GatewayIntentBits.GuildMembers,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent,
  GatewayIntentBits.GuildVoiceStates,
];

const client = new Client({ intents: intents });

client.commands = new Collection();
client.buttons = new Collection();
client.voiceUsers = new Collection()

moongoose.connect(process.env.DB_URI)

require('./handlers/system/eventHandler.js').init(client)

client.on('error', error => console.log(error))
client.on('warn', warn => console.log(warn))

client.login(process.env.TOKEN || "hello world")