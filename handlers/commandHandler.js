const fs = require('fs');

/**
 * @param {Client} client
 */
module.exports.init = async (client) => {
  console.log("[HANDLER] Занесение команд в коллекцию начато...");

  for (let dir of fs.readdirSync('./commands')) {
    for (let file of fs.readdirSync(`./commands/${dir}`).filter(f => f.endsWith(".js"))) {
      const cmd = require(`../commands/${dir}/${file}`);
      client.commands.set(cmd.data.name, cmd);
    }
  }
   console.log("[HANDLER] Занесение команд в коллекцию завершено...");
};