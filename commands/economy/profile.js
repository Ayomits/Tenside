const {
  CommandInteraction,
  EmbedBuilder,
} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const {userModel} = require('../../models/users');
const { createCanvas } = require("canvas");


module.exports = {
  data: new SlashCommandBuilder()
        .setName("profile")
        .setDescription("отобразить профиль пользователя")
        .addUserOption((option) =>
          option.setName("target").setDescription("target user").setRequired(false)
        ),
  
  /**
   * @param {CommandInteraction} interaction
   */

  async execute(interaction) { 
    const targetUser = interaction.options.get("target")

    const user = targetUser.user || interaction.user

    const canvas = createCanvas(500, 500)
    
  }
  
}