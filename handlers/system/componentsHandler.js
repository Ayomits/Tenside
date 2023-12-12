const fs = require('fs');
const path = require('path');

/**
 * @param {Client} client
 */
module.exports.init = async (folder, client) => {
  let start = Date.now()
  console.log(`[HANDLER] Занесение компонентов в коллекцию начато...`);

  fs.readdirSync(`./${folder}`).forEach((dir) => {
    fs.readdirSync(`./${folder}/${dir}`).forEach((subdir) => {
      fs.readdirSync(`./${folder}/${dir}/${subdir}`)
        .filter((file) => file.endsWith(".js"))
        .forEach((file) => {
          const component = require(path.resolve() + `/${folder}/${dir}/${subdir}/${file}`);
          client.buttons.set(component.customId, component);
        });
    });
  });

  console.log(`[HANDLER] Занесение компонентов в коллекцию завершено...`);
  console.log(`[COMPONENTHANDLER.JS] ${(Date.now() - start) / 1000}`);
};