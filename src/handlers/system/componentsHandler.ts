import { Client } from 'discord.js';
import * as fs from 'fs'
import * as path from 'path'

/**
 * @param {Client} client
 */
export const componentHandler = async (folder: string, client: Client) => {
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