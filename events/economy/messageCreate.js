
const { Events, Message } = require("discord.js");


/**
 * @param {Message} message
 */

module.exports = {
  name: Events.MessageCreate,
  once: false,
  async execute(message) {
  }
}