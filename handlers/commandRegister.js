const { REST, Routes, Client } = require('discord.js');

/**
 * 
 * @param {Client} client 
 * 
 */

const rest = new REST().setToken(process.env.TOKEN)

module.exports.init = async function register(client) {
  try {
    console.log("[REGISTER] Начинаю регистрировать команды...");

    const commands = client.commands.map(command => command.data.toJSON()) 
    const data = await rest.put(
      Routes.applicationCommands(client.user.id),
      { body: commands}
    )
      console.log(`[REGISTER] все команды успешно зарегестрированы. Команд всего: ${data.length}`);
  }
  catch (error) {
    console.log(error);
  }
}