const fs = require('fs');

/**
 * @param {Client} client
 */
module.exports.init = async (folder, collection, component) => {
  console.log(`[HANDLER] Занесение компонентов ${component} в коллекцию начато...`);

  for (let dir of fs.readdirSync(`./${folder}`)) {
    for (let file of fs.readdirSync(`./${folder}/${dir}`).filter(f => f.endsWith(".js"))) {
      const component = require(`../../${folder}/${dir}/${file}`);
      collection.set(component.customId, component);
    }
  }
   console.log(`[HANDLER] Занесение компонентов ${component} в коллекцию завершено...`);
};