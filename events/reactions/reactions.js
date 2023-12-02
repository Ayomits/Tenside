const axios = require("axios");
const { Events, Message } = require("discord.js");
const react = require('../../handlers/features/reactHandler');
const fs = require('fs');
const path = require("path");

// Function to find a reaction key based on alias
function findReactionKeyByAlias(alias, config) {
  for (let key in config) {
    const entry = config[key];
    if (entry.aliases && entry.aliases.includes(alias)) {
      return key;
    }
  }
  return null;
}

module.exports = {
  name: Events.MessageCreate,
  once: false,
  /**
   *
   * @param {Message} message
   */
  async execute(message) {
    if (message.author.bot || !message.content.toLowerCase().startsWith(process.env.PREFIX)) {
      return;
    }

    const reaction = message.content.toLowerCase().replace(process.env.PREFIX, "").split(" ");
    const reactionsConfig = JSON.parse(await fs.promises.readFile(path.resolve('configs/reactions.json'), "utf-8"));

    try {
      // Check if the entered reaction is an alias
      const reactionKey = findReactionKeyByAlias(reaction[0], reactionsConfig);

      // If it's an alias, get the actual reaction data
      const reactionData = reactionKey ? reactionsConfig[reactionKey] : reactionsConfig[reaction[0]];

      if (reactionData.isApi) {
        const apiUrl = `${process.env.API_URL}/gif?reaction=${reaction[0]}&format=${process.env.FORMAT}`;
        const response = await axios.get(apiUrl);
        await react(message, reaction, response.data.url);
      } else {
        // Ensure that linksConfig[reaction[0]] exists and is an array with a length
        const linksConfig = JSON.parse(await fs.promises.readFile(path.resolve('configs/reactionslink.json'), "utf-8"));
        const reactionKeyForLinks = reactionKey || reaction[0];
        
        if (linksConfig[reactionKeyForLinks] && linksConfig[reactionKeyForLinks].length > 0) {
          const randomIndex = Math.floor(Math.random() * linksConfig[reactionKeyForLinks].length);
          await react(message, reaction, linksConfig[reactionKeyForLinks][randomIndex]);
        } else {
          console.error(`Invalid or empty array for reaction key: ${reactionKeyForLinks}`);
        }
      }
    } catch (error) {
      console.error(error.message);
      // Handle error if needed
    }
  },
};
