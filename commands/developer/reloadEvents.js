const {
  CommandInteraction,
  EmbedBuilder,
} = require("discord.js");
const {init} = require('../../handlers/system/eventHandler')
const { SlashCommandBuilder } = require("@discordjs/builders");

const devs = JSON.parse(process.env.DEVELOPERS)

module.exports = {
  data: new SlashCommandBuilder()
    .setName("eventsreload")
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