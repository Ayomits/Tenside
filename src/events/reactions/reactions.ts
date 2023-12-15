import axios from "axios"
import { Events, Message } from "discord.js"
import {react} from '../../handlers/features/reactHandler'
import * as fs from 'fs'
import * as path from 'path'

function findReactionKeyByAlias(alias: string, config: any) {
  for (let key in config) {
    const entry = config[key];
    if (entry.aliases && entry.aliases.includes(alias)) {
      return key;
    }
  }
  return null;
}

export const reactions = {
  name: Events.MessageCreate,
  once: false,
  async execute(message: Message) {
    if (message.author.bot || !message.content.toLowerCase().startsWith(process.env.PREFIX || ".")) {
      return;
    }

    const reaction = message.content.toLowerCase().replace(process.env.PREFIX || ".", "").split(" ");
    const reactionsConfig = JSON.parse(await fs.promises.readFile(path.resolve('configs/reactions.json'), "utf-8"));

    try {
      const reactionKey = findReactionKeyByAlias(reaction[0], reactionsConfig) || reaction[0];
      const reactionData = reactionsConfig[reactionKey];

      if (!reactionData) {
        console.error(`Reaction key not found: ${reactionKey}`);
        return;
      }
      if (reactionData.isApi) {
        const apiUrl = `${process.env.API_URL}/gif?reaction=${reactionKey}&format=${process.env.FORMAT}`;
        const response = await axios.get(apiUrl);
        await react(message, reactionKey, response.data.url);
      } else {
        const linksConfig = JSON.parse(await fs.promises.readFile(path.resolve('configs/reactionslink.json'), "utf-8"));
        const reactionKeyForLinks = reactionKey;
        
        if (linksConfig[reactionKeyForLinks] && linksConfig[reactionKeyForLinks].length > 0) {
          const randomIndex = Math.floor(Math.random() * linksConfig[reactionKeyForLinks].length);
          await react(message, reactionKey, linksConfig[reactionKeyForLinks][randomIndex]);
        } else {
          console.error(`Invalid or empty array for reaction key: ${reactionKeyForLinks}`);
        }
      }
    } catch (error: any) {
      console.error(error.message);
    }
  },
};

export default reactions