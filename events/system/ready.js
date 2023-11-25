const { Events, Client } = require('discord.js');
const sequelize = require("../../db")
const fs = require("fs")
const path = require('path')


module.exports = {
  name: Events.ClientReady,
  once: true,
  /**
   * 
   * @param {Client} client 
   */
  async execute(client) {
    require('../../handlers/dbHandler').init()
    require('../../handlers/commandHandler').init(client)
    require('../../handlers/commandRegister').init(client)
    require('../../handlers/buttonsHandler').init(client)

    client.user.setStatus("dnd")
  }
}