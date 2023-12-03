const { Events, Client, Activity, ActivityType } = require('discord.js');

module.exports = {
  name: Events.ClientReady,
  once: true,
  /**
   * 
   * @param {Client} client 
   */
  async execute(client) {
    // подгрузка команд, компонентов, создание таблиц в СУБД

    require('../../handlers/system/commandHandler').init(client)
    require('../../handlers/system/componentsHandler').init("components", client.buttons, "кнопки")
    require('../../handlers/system/componentsHandler').init("components", client.modals, "модалки")
    require('../../handlers/system/componentsHandler').init("components", client.selects, "селекты")
    require('../../handlers/system/commandRegister').init(client)
    // require("../../handlers/system/usersHandler").userHandler(client) это блядство не работает

    client.user.setStatus("dnd")
    client.user.setActivity({
      name: `Приглядываю за вами :3`,
      type: ActivityType.Custom
    })
    
  }
}