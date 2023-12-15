"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventHandler = void 0;
const fs = require("fs");
/**
 * @param {Client} client
*/
const eventHandler = async (client) => {
    console.log(`[HANDLER] Event handler started!`);
    fs.readdirSync('./../../events').forEach(dir => {
        fs.readdirSync(`./../../events/${dir}`).filter(s => s.endsWith('.js')).forEach(file => {
            const event = require(`./../../events/${dir}/${file}`);
            if (!event.once) {
                console.log(`[${event.name.toUpperCase()}] успешно сработал! (once ${event.once})`);
                client.on(event.name, (...args) => event.execute(...args));
            }
            else {
                console.log(`[${event.name.toUpperCase()}] успешно сработал! (once: ${event.once})`);
                client.once(event.name, (...args) => event.execute(...args));
            }
        });
    });
};
exports.eventHandler = eventHandler;
