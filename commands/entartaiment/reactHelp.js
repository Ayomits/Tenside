const { CommandInteraction, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const fs = require("fs");
const path = require("path");
const img = `https://i.imgur.com/i3Y3gQF.png`
module.exports = {
  data: new SlashCommandBuilder()
    .setName("reactionshelp")
    .setDescription("Все команды реакций")
    .setDMPermission(true),

  async execute(interaction) {
    const configs = path.resolve("configs");
    const data = JSON.parse(await fs.promises.readFile(configs + "/reactions.json"));
    
    const descriptionembed = new EmbedBuilder().setTitle("Список реакций").setDescription("```Тут находится список всех команд-реакций.\nВы можете использовать их где угодно на сервере (но без оффтопа и спама)```").setColor('#2F3136');
    const loveEmbed = new EmbedBuilder().setTitle("Любовные команды").setImage(img).setColor('#2F3136');
    const emotionEmbed = new EmbedBuilder().setTitle("Команды с эмоциями").setImage(img).setColor('#2F3136');
    const actionEmbed = new EmbedBuilder().setTitle("Команды действий").setImage(img).setColor('#2F3136');

    let loveDescription = "";
    let emotionDescription = "";
    let actionDescription = "";

    for (let react in data) {
      switch (data[react].type) {
        case 'love':
          loveDescription += `> **${data[react].api_name}** - ${data[react].action}\n`;
          break;
        case 'emotion':
          emotionDescription += `> **${data[react].api_name}** - ${data[react].action}\n`;
          break;
        case 'action':
          actionDescription += `> **${data[react].api_name}** - ${data[react].action}\n`;
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

    await interaction.reply({ embeds: [descriptionembed, loveEmbed, emotionEmbed, actionEmbed] });
  },
};
