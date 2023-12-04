const {
  CommandInteraction,
  EmbedBuilder,
} = require("discord.js");
const {init} = require('../../handlers/system/commandHandler')

const { SlashCommandBuilder } = require("@discordjs/builders");

const devs = JSON.parse(process.env.DEVELOPERS)

module.exports = {
  data: new SlashCommandBuilder()
    .setName("commandsreload")
    .setDescription("Проверка задержи бота")
    .setDMPermission(true),

  /**
   *
   * @param {CommandInteraction} interaction
   *
   */
  async execute(interaction) {
  }
}