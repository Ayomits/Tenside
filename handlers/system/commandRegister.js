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
    const commandsData = await rest.put(
      Routes.applicationCommands(client.user.id),
      { body: commands}
    )
      console.log(`[REGISTER] Все команды успешно зарегестрированы. Команд всего: ${commandsData.length}`);
  }
  catch (error) {
    console.log(error);
  }
}