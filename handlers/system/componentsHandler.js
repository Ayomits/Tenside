const fs = require('fs');
const path = require('path');

/**
 * @param {Client} client
 */
module.exports.init = async (folder, component, client) => {
  console.log(`[HANDLER] Занесение компонентов ${component} в коллекцию начато...`);

  for (let dir of fs.readdirSync(`./${folder}`)) {
    for (let subdir of fs.readdirSync(`./${folder}/${dir}`)) {
      for (let file of fs.readdirSync(`./${folder}/${dir}/${subdir}`).filter(f => f.endsWith(".js"))) {
        const component = require(path.resolve() + `/${folder}/${dir}/${subdir}/${file}`)
        client.buttons.set(component.customId, component)
      }
    }
  }
   console.log(`[HANDLER] Занесение компонентов ${component} в коллекцию завершено...`);
};