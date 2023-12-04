const {
  CommandInteraction,
  EmbedBuilder,
  MessageCollector,
  ComponentType,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder
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
    const filter = i => {
      return i.user.id === interaction.user.id
    }

    const button = new ButtonBuilder()
                  .setCustomId(interaction.user.id)
                  .setLabel("test")
                  .setStyle(ButtonStyle.Success)

    const collector = interaction.channel.createMessageComponentCollector({
      componentType: ComponentType.Button,
      filter: filter,
      time: 10_000
    })
    await interaction.reply({components: [new ActionRowBuilder().addComponents(button)]})
    collector.on("collect", async (inter) => {
      if (inter.customId === interaction.user.id) {
        await inter.reply({content: "Сработал коллектор"})
      }
    })

  }
}
