const {
  CommandInteraction,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

const data = new SlashCommandBuilder()
  .setName("sendmodalmessage")
  .setDescription("Sends a random gif!")
  .addChannelOption((option) =>
    option
      .setName("channel")
      .setRequired(true)
      .setDescription("Выберите канал отправки сообщения")
  );

module.exports = {
  data: data,

  /**
   * @param {CommandInteraction} interaction
   */

  async execute(interaction) {
    const channelId = interaction.options.get("channel").value;
    console.log(channelId);
    const channel = interaction.client.channels.cache.get(channelId)
    
  },
};
