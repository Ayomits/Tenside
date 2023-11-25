const {
  CommandInteraction,
  EmbedBuilder,
  PermissionFlagsBits,
  TextInputStyle,
  TextInputBuilder,
  ModalBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");


module.exports = {
  data: new SlashCommandBuilder()
        .setName("idk")
        .setDescription("создание анкеты для набора в стафф")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  /**
   * @param {CommandInteraction} interaction
   */

  async execute(interaction) {
    const embed = new EmbedBuilder()
                  .setTitle("Настройка анкет")
                  .setDescription("Сейчас вам нужно настроить анкету")
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
          .setCustomId("firstBtn")
          .setLabel("hello world")
          .setStyle(ButtonStyle.Primary)
    )

    return await interaction.reply({embeds: [embed], components: [row]})

  }
}