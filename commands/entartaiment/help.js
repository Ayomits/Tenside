const {
  CommandInteraction,
  EmbedBuilder,
  ComponentType,
  filter,
  PermissionFlagsBits,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ActionRowBuilder,
} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const fs = require("fs");
const path = require("path");
const img = `https://i.imgur.com/i3Y3gQF.png`;
module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Все команды бота")
    .setDMPermission(true),

  async execute(interaction) {
    const configs = path.resolve("configs");
    const descriptionembed = new EmbedBuilder()
      .setTitle("Список команд")
      .setDescription(
        "Здесь вы можете выбрать модуль комманд о которых вы можете узнать."
      )
      .setColor("#2F3136")
      .setImage(img);
    const helpselect = new StringSelectMenuBuilder()
      .setCustomId("HelpSelect")
      .setMaxValues(1)
      .setPlaceholder(`Выберите нужный модуль!`)
      .setOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel("Экономика")
          .setValue("economy")
          .setDescription("Команды экономики")
          .setEmoji("💰"),

        new StringSelectMenuOptionBuilder()
          .setLabel("Браки")
          .setValue("marry")
          .setDescription("Команды брака")
          .setEmoji("💍"),

        new StringSelectMenuOptionBuilder()
          .setLabel("Реакции")
          .setValue("reaction")
          .setDescription("Команды Реакции")
          .setEmoji("🎭")
      );
    const row = new ActionRowBuilder().setComponents(helpselect);

    const helpmessage = await interaction.reply({
      embeds: [descriptionembed],
      components: [row],
    });
    const collectorFilter = (i) => i.user.id === interaction.user.id;
    const collector = helpmessage.createMessageComponentCollector({
      componentType: ComponentType.StringSelect,
      filter: collectorFilter,
    });

    collector.on("collect", async (i) => {
      const selection = i.values[0];
      if (selection == `reaction`) {
        const data = JSON.parse(
          await fs.promises.readFile(configs + "/reactions.json")
        );

        const descriptionembed = new EmbedBuilder()
          .setTitle("Список реакций")
          .setDescription(
            "```Тут находится список всех команд-реакций.\nВы можете использовать их где угодно на сервере (но без оффтопа и спама)```"
          )
          .setColor("#2F3136");
        const loveEmbed = new EmbedBuilder()
          .setTitle("Любовные команды")
          .setImage(img)
          .setColor("#2F3136");
        const emotionEmbed = new EmbedBuilder()
          .setTitle("Команды с эмоциями")
          .setImage(img)
          .setColor("#2F3136");
        const actionEmbed = new EmbedBuilder()
          .setTitle("Команды действий")
          .setImage(img)
          .setColor("#2F3136");
        let loveDescription = "";
        let emotionDescription = "";
        let actionDescription = "";

        for (let react in data) {
          switch (data[react].type) {
            case "love":
              loveDescription += `> **${data[react].api_name} (${data[react].aliases})** - ${data[react].action}\n`;
              break;
            case "emotion":
              emotionDescription += `> **${data[react].api_name} (${data[react].aliases})** - ${data[react].action}\n`;
              break;
            case "action":
              actionDescription += `> **${data[react].api_name} (${data[react].aliases})** - ${data[react].action}\n`;
              break;
            default:
              break;
          }
        }

        if (loveDescription !== "") {
          loveEmbed.setDescription(loveDescription.trim());
        } else {
          loveEmbed.setDescription("Команды любви не найдены.");
        }

        if (emotionDescription !== "") {
          emotionEmbed.setDescription(emotionDescription.trim());
        } else {
          emotionEmbed.setDescription("Команды с эмоциями не найдены.");
        }

        if (actionDescription !== "") {
          actionEmbed.setDescription(actionDescription.trim());
        } else {
          actionEmbed.setDescription("Команды действий не найдены.");
        }

        await i.message.edit({
          embeds: [descriptionembed, loveEmbed, emotionEmbed, actionEmbed],
          components: [],
        });
      } else {
        const data = JSON.parse(
          await fs.promises.readFile(configs + "/help.json")
        );

   
        
        const economyEmbed = new EmbedBuilder()
          .setImage(img)
          .setTitle(`Список команд`)
          .setColor("#2F3136");

        let economyDescription = "";

        for (let type in data) {
          switch (data[type].type) {
            case selection:
              economyDescription += `> **${data[type].name}** - ${data[type].description}\n`;
              break;
          }
        }

        if (economyDescription !== "") {
          economyEmbed.setDescription(economyDescription.trim());
        } else {
          economyEmbed.setDescription("Команды не найдены.");
        }

        await i.message.edit({
          embeds: [ economyEmbed],
          components: [],
        });
      }
    });
  },
};
