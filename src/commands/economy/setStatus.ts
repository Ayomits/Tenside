const { CommandInteraction } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { userModel } = require("../../models/users");

module.exports = {
  data: new SlashCommandBuilder()
        .setName("setstatus")
        .setDescription("установить статус")
        .addStringOption((option) => option.setName('status').setDescription('your status').setRequired(true))
        .addUserOption((option) => option.setName('target').setDescription('target user').setRequired(false)),

  /**
   * @param {CommandInteraction} interaction
   */

  async execute(interaction) {
    let user = interaction.options.getUser('targetuser') || interaction.user
    let response = ''
    const status = interaction.options.get('status').value

    if ((await interaction.guild.members.fetch({force: true})) && user != interaction.user){
      response += `Статуса пользователя <@${user.id}> успешно обновлён`
      await updateUser(interaction.guildId, user.id, status)
    } else {
      user = interaction.user
      response += `Ваш статус успешно обновлён`
      await this.updateUser(interaction.guildId, user.id, status)
    }

    await interaction.reply({content: response})
  },

  /**
   * 
   * @param {String} guildId 
   * @param {String} userId 
   * @param {String} status 
   */
  async updateUser(guildId, userId, status) {
    await userModel.findOneAndUpdate({guild_id: guildId, user_id: userId}, {$set: {status: status}})
  }
}