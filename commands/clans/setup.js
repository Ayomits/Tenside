const {
  CommandInteraction
} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { clanSetupModel } = require('../../models/clans')

module.exports = {
  data: new SlashCommandBuilder()
        .setName('clancreate')
        .setDescription('undefined'),

  /**
  * @param {CommandInteraction} interaction 
   */
  async execute(interaction) {
    const role = interaction.options.get('role')
    const categoryId = interaction.options.get('categoryid')

    await clanSetupModel.findOne({guild_id: interaction.guildId}).then(async (result) => {
      if (result !== null) {
        await clanSetupModel.updateOne({guild_id: interaction.guildId}, {$set: {roleId: role.role.id, categoryId: categoryId}}).then(async () => {
          await interaction.reply({content: "Роль и канал успешно обновлены", ephemeral: true})
        })
      } else {
        await clanSetupModel.create({guild_id: interaction.guildId, roleId: role.role.id, categoryId: categoryId.value}).then(async () => {
          await interaction.reply({content: "Роль и категория успешно созданы", ephemeral: true})
        })
      }
    })
  }

}