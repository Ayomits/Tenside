const { CommandInteraction, Client } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

const devs = JSON.parse(process.env.DEVELOPERS);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("reload")
    .setDescription("Проверка задержи бота")
    .setDMPermission(true)
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription("тип перезагружаемого")
        .addChoices(
          { name: "events", value: "events" },
          { name: "commands", value: "commands" },
          { name: "components", value: "components" }
        )
    .setRequired(true)
    ),

  /**
   *
   * @param {CommandInteraction} interaction
   *
   */
  async execute(interaction) {
    if (devs.includes(String(interaction.user.id))) {
      const options = interaction.options.get("type");
      switch (options.value) {
        case "events".toLowerCase():
          try {
            await interaction.deferReply();
            await this.reloadEvents(interaction.client);
            await interaction.followUp({
              content: "ивенты успешно перезагружены",
              ephemeral: true,
            });
          } catch (err) {
            await interaction.channel.send({
              content: "что-то пошло не так\n" + err,
              ephemeral: true,
            });
          }

        case "commands".toLowerCase():
          try {
            await interaction.deferReply();
            await this.reloadCommands(interaction.client);
            await interaction.followUp({
              content: "команды успешно перезагружены",
            });
          } catch (err) {
            await interaction.reply({
              content: "что-то пошло не так\n" + err,
              ephemeral: true,
            });
          }
        case "components":
          try {
            await interaction.deferReply();
            await this.reloadComponents(interaction.client);
            await interaction.followUp({
              content: "компоненты успешно перезагружены",
              ephemeral: true,
            });
          } catch (err) {
            await interaction.deferReply();
            await interaction.followUp({
              content: "что-то пошло не так\n" + err,
              ephemeral: true,
            });
          }
      }
    }
  },

  /**
   *
   * @param {Client} client
   */

  async reloadCommands(client) {
    client.commands.clear();
    await require("../../handlers/system/commandHandler").init(client);
    await require("../../handlers/system/commandRegister").init(client);
  },
  /**
   *
   * @param {Client} client
   */
  async reloadEvents(client) {
    
    await require("../../handlers/system/eventHandler").init(client);
  },
  /**
   *
   * @param {Client} client
   */
  async reloadComponents(client) {
    client.buttons.clear()
    await require("../../handlers/system/componentsHandler").init(
      "components",
      client
    );
  },
};
