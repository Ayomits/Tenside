const {
  CommandInteraction,
  EmbedBuilder,
  ComponentType,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ActionRowBuilder,
} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const fs = require("fs").promises;
const path = require("path");
const img = `https://i.imgur.com/i3Y3gQF.png`;
const options = [];
const configs = path.resolve("configs");
const fsPromises = require("fs").promises;

async function requireCommands() {
  const config = JSON.parse(
    await fs.readFile(configs + "/helpSelectMenu.json", "utf-8")
  );

  Object.values(config.commands).forEach((commandInfo) => {
    const description = commandInfo.description || "Undefined Description";
    const value = commandInfo.value || "Undefined Value";
    const emoji = commandInfo.emoji || "Undefined Emoji";
    const name = commandInfo.name || "Undefined Name";
    options.push(
      new StringSelectMenuOptionBuilder()
        .setLabel(name)
        .setEmoji(emoji)
        .setValue(value)
        .setDescription(description)
    );
  });
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Все команды бота")
    .setDMPermission(true),

  async execute(interaction) {
    await requireCommands();

    const select = new StringSelectMenuBuilder()
      .setCustomId("select")
      .setPlaceholder("Выберите модуль")
      .addOptions(options);
    const row = new ActionRowBuilder().setComponents(select);

    options.splice(0);

    const descriptionembed = new EmbedBuilder()
      .setTitle(`Хелп Меню`)
      .setDescription(
        `\`\`\`Тут находится список всех модулей команд.\nВы должны выбрать нужный модуль комманд\`\`\``
      )
      .setColor("#2F3136")
      .setImage(img);
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
          await fs.readFile(configs + "/reactions.json", "utf-8")
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
              loveDescription += `> **${data[react].api_name} (${data[react].aliases}) ${data[react].cost}<:solana:1183097799756238858>** - ${data[react].action}\n`;
              break;
            case "emotion":
              emotionDescription += `> **${data[react].api_name} (${data[react].aliases}) ${data[react].cost}<:solana:1183097799756238858>** - ${data[react].action}\n`;
              break;
            case "action":
              actionDescription += `> **${data[react].api_name} (${data[react].aliases}) ${data[react].cost}<:solana:1183097799756238858>** - ${data[react].action}\n`;
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
        const config = JSON.parse(
          await fs.readFile(configs + "/help.json", "utf-8")
        );
        const filteredEmbed = new EmbedBuilder()
          .setColor("#2F3136")
          .setImage(img);

        const selectedCategory = i.values[0];

        const filteredCommands = [];
        for (const [category, commands] of Object.entries(config.commands)) {
          if (category === selectedCategory) {
            for (const [commandName, commandInfo] of Object.entries(commands)) {
              const { api_name, description } = commandInfo;
              filteredCommands.push(`> **${api_name}** - ${description}\n`);
              filteredEmbed.setTitle(`Хелп меню - ${selectedCategory}`);
            }
            break;
          }
        }

        const embedDescriptions = filteredCommands.join("");
        filteredEmbed.setDescription(embedDescriptions || "Команды не найдены");

        await i.message.edit({
          embeds: [filteredEmbed],
          components: [],
        });
      }
    });
  },
};
