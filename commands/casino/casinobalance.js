const {
    CommandInteraction,
    EmbedBuilder,
  } = require("discord.js");
  const { SlashCommandBuilder } = require("@discordjs/builders");
  const { casinoModel } = require('../../models/casino')
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName("casinobalance")
      .setDescription("проверка баланса казино"),
  
    /**
     * @param {CommandInteraction} interaction
     */
    async execute(interaction) {
      const embed = new EmbedBuilder().setTitle(`Баланс казино - ${interaction.guild.name}`)
  
      const balance = await casinoModel.findOne({ guild_id: interaction.guild.id })
  
      let description = "";
      if (balance) {
        description = `Баланс: \n` + "```" + `${Math.floor(balance.balance)}` + "```";
      } else {
        const newbalance = await casinoModel.create({ guild_id: interaction.guild.id })
        description = `Баланс: \n` + "```" + `${Math.floor(newbalance.balance)}` + "```";
      }
  
      await interaction.reply({ embeds: [embed.setDescription(description).setThumbnail(interaction.guild.iconURL())] });
    },
  };
  