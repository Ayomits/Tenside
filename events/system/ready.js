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

    require("../../handlers/system/commandHandler").init(client);
    require("../../handlers/system/componentsHandler").init(
      "components",
      "кнопки",
      client
    );
    require("../../handlers/system/componentsHandler").init(
      "components",
      "модалки",
      client
    );
    require("../../handlers/system/componentsHandler").init(
      "components",
      "селекты",
      client
    );
    require("../../handlers/system/commandRegister").init(client);
    await require("../../handlers/system/usersHandler").usersHandler(client);

    client.user.setStatus("dnd");
    client.user.setActivity({
      name: `Приглядываю за вами :3`,
      type: ActivityType.Custom,
    });
    console.log(`Запущенно!`);
    cron.schedule(
      "00 03 * * *",
      () => {
        TimelyModel.TimelyModel.collection.deleteMany()
      .then(ok =>{performDailyTask()})
      .catch(err => {console.log(err)})
      },
      { timezone: "Europe/Moscow" }
    );  

    // Функция для выполнения задачи
    const performDailyTask = () => {
      console.log("Выполняю задачу каждый день в 03:00 по московскому времени");
     
    };
  },
};
