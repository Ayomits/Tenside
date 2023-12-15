"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commandHandler = void 0;
const fs = require("fs");
/**
 * @param {Client} client
 */
const commandHandler = async (client) => {
    let start = Date.now();
    console.log("[HANDLER] Занесение команд в коллекцию начато...");
    fs.readdirSync('./commands').forEach((dir) => {
        fs.readdirSync(`./commands/${dir}`)
            .filter((file) => file.endsWith(".js"))
            .forEach((file) => {
            const cmd = require(`../../commands/${dir}/${file}`);
            client.commands.set(cmd.data.name, cmd);
        });
    });
    console.log("[HANDLER] Занесение команд в коллекцию завершено...");
    console.log(`[COMMANDHANDLER.JS] ${(Date.now() - start) / 1000}`);
};
exports.commandHandler = commandHandler;
