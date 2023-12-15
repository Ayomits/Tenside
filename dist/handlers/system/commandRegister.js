"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commandRegister = void 0;
const discord_js_1 = require("discord.js");
/**
 *
 * @param {Client} client
 *
 */
const rest = new discord_js_1.REST().setToken(process.env.TOKEN || "");
const commandRegister = async function register(client) {
    try {
        console.log("[REGISTER] Начинаю регистрировать команды...");
        const commands = client.commands.map(command => command.data.toJSON());
        const clientId = client.user?.id ?? "";
        const commandsData = await rest.put(discord_js_1.Routes.applicationCommands(clientId), { body: commands });
        console.log(`[REGISTER] Все команды успешно зарегестрированы. Команд всего: ${commandsData.length}`);
    }
    catch (error) {
        console.log(error);
    }
};
exports.commandRegister = commandRegister;
