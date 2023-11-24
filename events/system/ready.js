const { Events } = require('discord.js');

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    require('../../handlers/commandHandler').init(client)
    require('../../handlers/commandRegister').init(client)
  }
}