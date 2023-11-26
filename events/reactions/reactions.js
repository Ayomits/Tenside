const axios = require("axios");;
const { Events, Message } = require("discord.js");
const react = require('../../handlers/features/reactHandler');
const fs = require('fs');
const path = require("path");
const { url } = require("inspector");

module.exports = {
  name: Events.MessageCreate,
  once: false,
  /**
   *
   * @param {Message} message
   */
  async execute(message) {
    if (message.author.bot) return;
    if (!message.content.toLowerCase().startsWith(process.env.PREFIX)) return;
    const reaction = message.content.replace(process.env.PREFIX, "").split(" ");
    const data = JSON.parse(await fs.promises.readFile(path.resolve('configs/reactions.json'), "utf-8"))
    

    if (data[reaction[0]].isApi) {

    console.log(reaction);
    await axios
      .get(
        `${process.env.API_URL}/gif?reaction=${reaction[0]}&format=${process.env.FORMAT}`
      )
      .then(async (response) => {
        await react(message, reaction, response.data.url)
      })
      .catch(() => {
        return;
      });
  } else {
    const urls = JSON.parse(await fs.promises.readFile(path.resolve('configs/reactionslink.json'), "utf-8"))
    const randomIndex = (Math.floor(Math.random() * urls[reaction[0]].length));
    await react(message, reaction, urls[reaction[0]][randomIndex])
  }
},
};
