const { Client, GatewayIntentBits, Collection } = require("discord.js");
const env = require('dotenv')

env.config()

const intents = [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.DirectMessages,
  GatewayIntentBits.GuildMembers,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent,
];

const client = new Client({ intents: intents });
client.commands = new Collection();
client.commandsArray = [];

require('./handlers/eventHandler.js').init(client)

client.on('error', error => console.log(error))
client.on('warn', warn => console.log(warn))

client.login(process.env.TOKEN || "hello world")