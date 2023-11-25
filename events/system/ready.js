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
    require('../../handlers/system/dbHandler').init()
    require('../../handlers/system/commandHandler').init(client)
    require('../../handlers/system/commandRegister').init(client)
    require('../../handlers/system/buttonsHandler').init(client)

    client.user.setStatus("dnd")
    
  }
}