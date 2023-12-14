import { SlashCommand } from "../../types";

import {
    CommandInteraction,
    EmbedBuilder,
  } from "discord.js"
  import { SlashCommandBuilder } from "@discordjs/builders"
  import { casinoModel } from '../../models/casino'
  
  const command: SlashCommand = {
    data: new SlashCommandBuilder()
      .setName("casinobalance")
      .setDescription("проверка баланса казино"),
  
    /**
     * @param {CommandInteraction} interaction
     */
    async execute(interaction: CommandInteraction) {
      const embed = new EmbedBuilder().setTitle(`Баланс казино - ${interaction.guild?.name}`)
  
      const balance = await casinoModel.findOne({ guild_id: interaction.guild?.id })
  
      let description = "";
      if (balance) {
        description = `Баланс: \n` + "```" + `${Math.floor(balance.balance)}` + "```";
      } else {
        const newbalance = await casinoModel.create({ guild_id: interaction.guild?.id })
        description = `Баланс: \n` + "```" + `${Math.floor(newbalance.balance)}` + "```";
      }
  
      await interaction.reply({ embeds: [embed.setDescription(description).setThumbnail(interaction.guild?.icon ? interaction.guild?.iconURL() : "https://desu.shikimori.one/uploads/poster/characters/119413/main_alt-b5e67a0983c746c2171da4eb7d5c14b1.jpeg")] });
    },
  };
export default command