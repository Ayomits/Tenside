const {
  CommandInteraction, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder, ButtonBuilder, ButtonStyle, ComponentType
} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const {clanSetupModel, clanModel} = require('../../models/clans')
const {userModel} = require('../../models/users')
const fs = require('fs')
const path = require('path')

module.exports = {
  data: new SlashCommandBuilder()
        .setName('delete-clan')
        .setDescription('создание клана'),

  /**
   * 
   * @param {CommandInteraction} interaction 
   */

  async execute(interaction) {
    const userOwner = await clanModel.findOne({clanOwner: interaction.user.id})
    
    
    if (userOwner) {
      const embed = new EmbedBuilder()
                    .setTitle('Система кланов')
                    .setDescription('подтвердите свои действия')

      const accept = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('accept')
            .setLabel('Да!')
            .setStyle(ButtonStyle.Success),

        new ButtonBuilder()
            .setCustomId('cancel')
            .setLabel('Нет!')
            .setStyle(ButtonStyle.Danger)
      )
      await interaction.reply({embeds: [embed], components: [accept]})

      interaction.channel.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: 30_000
      }).on('collect', async (inter) => {
        if (inter.customId === 'accept') {
          if (inter.user.id === interaction.user.id) {
            await inter.deferReply()
            await Promise.all([
              inter.guild.roles.cache.get(userOwner.clanRole).delete(),
              inter.guild.channels.cache.get(userOwner.clanChat).delete(),
              inter.guild.channels.cache.get(userOwner.clanVoice).delete(),
            ])
            const clanName = userOwner.clanName
            await clanModel.deleteOne({clanOwner: inter.user.id})
            await inter.message.delete()
            await inter.editReply({components: [], embeds: [], content: `Клан ${clanName} успешно удалён...`})
          }
        } else if (inter.customId === 'cancel') {
          await inter.message.delete()
        }
      })
    }

    return await interaction.reply({content: 'У вас нет клана', ephemeral: true})
    
    
  },
}