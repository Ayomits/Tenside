const fs = require('fs');

/**
 * @param {Client} client
 */
module.exports.init = async (client) => {
  console.log("[HANDLER] Занесение кнопок в коллекцию начато...");

  for (let dir of fs.readdirSync('./components')) {
    for (let file of fs.readdirSync(`./components/${dir}`).filter(f => f.endsWith(".js"))) {
      const button = require(`../../components/${dir}/${file}`);
      client.buttons.set(button.customId, button);
    }
  }
  console.log("[HANDLER] Занесение кнопок в коллекцию завершено...");
};