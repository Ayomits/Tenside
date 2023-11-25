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
    // подгрузка команд, компонентов, создание таблиц в СУБД

    require('../../handlers/system/dbHandler').init()
    require('../../handlers/system/commandHandler').init(client)
    require('../../handlers/system/commandRegister').init(client)
    require('../../handlers/system/componentsHandler').init("components", client.buttons, "кнопки")
    require('../../handlers/system/componentsHandler').init("components", client.modals, "модалки")
    require('../../handlers/system/componentsHandler').init("components", client.selects, "селекты")

    client.user.setStatus("dnd")
    
  }
}