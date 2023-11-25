const axios = require("axios");;
const { Events, Message } = require("discord.js");
const react = require('../../handlers/features/reactHandler');

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

    console.log(reaction);
    await axios
      .get(
        `${process.env.API_URL}/gif?reaction=${reaction[0]}&format=${process.env.FORMAT}`
      )
      .then(async (response) => {
        await react(message, reaction, response)
      })
      .catch(() => {
        return;
      });
  },
};
