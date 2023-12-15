import { Events, Client, Activity, ActivityType } from "discord.js"
import * as TimelyModel from '../../models/users'
import * as cron from 'node-cron'
import { BotEvent } from "../../types";
import { commandHandler } from "../../handlers/system/commandHandler";
import { componentHandler } from "../../handlers/system/componentsHandler";
import { commandRegister } from "../../handlers/system/commandRegister";
import { usersHandler } from "../../handlers/system/usersHandler";
import { checkUsersInVoice } from "../../handlers/system/checkUsersInVoice";

const ready: BotEvent = {
  name: Events.ClientReady,
  once: true,
  /**
   *
   * @param {Client} client
   */
  async execute(client: Client) {
    // подгрузка команд, компонентов, создание таблиц в СУБД
    let start = Date.now()
    commandHandler(client)
    componentHandler("components", client)
    commandRegister(client)
    usersHandler(client)
    checkUsersInVoice(client)

    console.log(client.voiceUsers);
    
    client.user?.setStatus("dnd");
    client.user?.setActivity({
      name: `Приглядываю за вами :3`,
      type: ActivityType.Custom,
    });
    

    const performDailyTask = async () => {
      console.log("Выполняю задачу каждый день в 03:00 по московскому времени");
      await TimelyModel.TimelyModel.deleteMany({})
    };

    console.log(`[TASK] Запущенно!`);
    cron.schedule(
      "00 3 * * *",
      performDailyTask,
      { timezone: "Europe/Moscow" }
    );

    let end = (Date.now() - start) / 1000

    console.log(`[READY.JS] Время запуска ${end}`);
  },
};

export default ready