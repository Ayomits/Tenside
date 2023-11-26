const { Events, Client } = require('discord.js');

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
    require('../../handlers/system/componentsHandler').init("components", client.buttons, "кнопки")
    require('../../handlers/system/componentsHandler').init("components", client.modals, "модалки")
    require('../../handlers/system/componentsHandler').init("components", client.selects, "селекты")
    require('../../handlers/system/commandRegister').init(client)
   
    client.user.setStatus("dnd")
    client.user.setActivity()
  }
}