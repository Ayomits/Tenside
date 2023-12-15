"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const TimelyModel = require("../../models/users");
const cron = require("node-cron");
const commandHandler_1 = require("../../handlers/system/commandHandler");
const componentsHandler_1 = require("../../handlers/system/componentsHandler");
const commandRegister_1 = require("../../handlers/system/commandRegister");
const usersHandler_1 = require("../../handlers/system/usersHandler");
const checkUsersInVoice_1 = require("../../handlers/system/checkUsersInVoice");
const ready = {
    name: discord_js_1.Events.ClientReady,
    once: true,
    /**
     *
     * @param {Client} client
     */
    async execute(client) {
        // подгрузка команд, компонентов, создание таблиц в СУБД
        let start = Date.now();
        (0, commandHandler_1.commandHandler)(client);
        (0, componentsHandler_1.componentHandler)("components", client);
        (0, commandRegister_1.commandRegister)(client);
        (0, usersHandler_1.usersHandler)(client);
        (0, checkUsersInVoice_1.checkUsersInVoice)(client);
        console.log(client.voiceUsers);
        client.user?.setStatus("dnd");
        client.user?.setActivity({
            name: `Приглядываю за вами :3`,
            type: discord_js_1.ActivityType.Custom,
        });
        const performDailyTask = async () => {
            console.log("Выполняю задачу каждый день в 03:00 по московскому времени");
            await TimelyModel.TimelyModel.deleteMany({});
        };
        console.log(`[TASK] Запущенно!`);
        cron.schedule("00 3 * * *", performDailyTask, { timezone: "Europe/Moscow" });
        let end = (Date.now() - start) / 1000;
        console.log(`[READY.JS] Время запуска ${end}`);
    },
};
exports.default = ready;
