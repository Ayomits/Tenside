const { SlashCommandBuilder } = require("@discordjs/builders");
const { joinVoiceChannel } = require('@discordjs/voice');

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
const { voiceModel } = require("../../models/channel");
const devs = JSON.parse(process.env.DEVELOPERS)

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setvoice")
    .setDescription("Указать голосовой канал")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("Канал")
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildVoice)
    ),

  async execute(interaction) {
    if (interaction.guild.id == `1111018589407936522` || interaction.guild.id == `1092042238781034538`){
    if (devs.includes(String(interaction.user.id)) || interaction.member.permissions.has(8n)
    ){
    
    const channel = interaction.options.getChannel("channel");

    const checkGuild = await voiceModel.findOne({
      guild_id: interaction.guild.id,
    });

    if (checkGuild) {
      try {
        await voiceModel.updateOne({
          guild_id: interaction.guild.id,
          channel_id: channel.id,
        });
        await interaction.reply({
          content: `Новый канал был указан`,
          ephemeral: true,
        });
        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      const channelModels = await voiceModel.findOne({
        guild_id: interaction.guild.id,
        channel_id: channel.id,
      });
      if (!channelModels) {
        try {
          await voiceModel.create({
            guild_id: interaction.guild.id,
            channel_id: channel.id,
          });
          const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
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
  }else {return interaction.reply({ephemeral: true, content:`Недоступно!`})}
    }else {return interaction.reply({ephemeral: true, content:`Недоступно!`})}
}
}