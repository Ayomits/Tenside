const {
  CommandInteraction,
  EmbedBuilder
} = require("discord.js");
const os = require('os')
const { SlashCommandBuilder } = require("@discordjs/builders");

const devs = JSON.parse(process.env.DEVELOPERS)

module.exports = {
  data: new SlashCommandBuilder()
    .setName("hostconf")
    .setDescription("Проверка задержи бота")
    .setDMPermission(true),

  /**
   *
   * @param {CommandInteraction} interaction
   *
   */
  async execute(interaction) {
    const embed = new EmbedBuilder()
                  .setName("hostconf")
                  .setDescription(`Процессор ${os.cpus[0].model}. Доступная оперативная память: ${os.freemem}`)
    await interaction.reply({embeds: [embed], ephemeral: true})
  }
}
