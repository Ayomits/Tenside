const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  ComponentType,
  CategoryChannel,
  ChannelType,
  PermissionFlagsBits
} = require("discord.js");
const { channelModel } = require("../../models/channel");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setchannel")
    .setDescription("Указать канал для приветствия")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("Канал для приветсвия")
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText)
    ),

  async execute(interaction) {
    const channel = interaction.options.getChannel("channel");

    const checkGuild = await channelModel.findOne({
      guild_id: interaction.guild.id,
    });

    if (checkGuild) {
      try {
        await channelModel.updateOne({
          guild_id: interaction.guild.id,
          channel_id: channel.id,
        });
        await interaction.reply({
          content: `Новый канал был указан`,
          ephemeral: true,
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      const channelModels = await channelModel.findOne({
        guild_id: interaction.guild.id,
        channel_id: channel.id,
      });
      if (!channelModels) {
        try {
          await channelModel.create({
            guild_id: interaction.guild.id,
            channel_id: channel.id,
          });
          await interaction.reply({
            content: `Канал был указан`,
            ephemeral: true,
          });
        } catch (err) {
          console.log(err);
        }
      }
    }
  },
};
