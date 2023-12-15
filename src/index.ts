import { Client, GatewayIntentBits, Collection, Message } from 'discord.js'
import * as env from 'dotenv'
import * as mongoose from 'mongoose'
import {SlashCommand, Button} from './types'
import { eventHandler } from './handlers/system/eventHandler'

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

client.commands = new Collection<string, SlashCommand>()
client.buttons = new Collection<string, Button>()
client.voiceUsers = new Collection<string, any>()

mongoose.connect(process.env.DB_URI || 'mongodb://127.0.0.1/TensideLocal')

eventHandler(client)

client.on('error', (error: Error) => console.log(error));
client.on('warn', (warn: string) => console.log(warn));

client.login(process.env.TOKEN || "hello world")