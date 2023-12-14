import { REST, Routes, Client }  from "discord.js";


/**
 * 
 * @param {Client} client 
 * 
 */

const rest = new REST().setToken(process.env.TOKEN || "");

module.exports.init = async function register(client: Client) {
  try {
    console.log("[REGISTER] Начинаю регистрировать команды...");

    const commands = client.commands.map(command => command.data.toJSON()) 
    const clientId: string = client.user?.id ?? "";
    const commandsData: any = await rest.put(
      Routes.applicationCommands(clientId),
      { body: commands}
    )
      console.log(`[REGISTER] Все команды успешно зарегестрированы. Команд всего: ${commandsData.length}`);
  }
  catch (error) {
    console.log(error);
  }
}
