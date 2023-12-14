"use strict";
const { Events, Client, Activity, ActivityType } = require("discord.js");
const TimelyModel = require(`../../models/users`);
const cron = require(`node-cron`);
module.exports = {
    name: Events.ClientReady,
    once: true,
    /**
     *
     * @param {Client} client
     */
    async execute(client) {
        // подгрузка команд, компонентов, создание таблиц в СУБД
        let start = Date.now();
        require("../../handlers/system/commandHandler").init(client);
        require("../../handlers/system/componentsHandler").init("components", client);
        require("../../handlers/system/commandRegister").init(client);
        require("../../handlers/system/usersHandler").usersHandler(client);
        require('../../handlers/system/checkUsersInVoice').checkUsersInVoice(client);
        console.log(client.voiceUsers);
        client.user.setStatus("dnd");
        client.user.setActivity({
            name: `Приглядываю за вами :3`,
            type: ActivityType.Custom,
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
