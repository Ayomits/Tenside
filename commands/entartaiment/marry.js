const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, EmbedBuilder } = require("discord.js");
const { userModel } = require("../.././models/users");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("marry")
    .setDescription("предложить брак пользователю")
    .addUserOption((option) =>
      option.setName("target").setDescription("target user")
    ),

  /**
   *
   * @param {CommandInteraction} interaction
   */

  async execute(interaction) {
    const target = interaction.options.get("target")
    const targetUser = userModel.findOne({
      guild_id: interaction.guildId,
      user_id: target.user.id,
    });

    const authorUser = userModel.findOne({
      guild_id: interaction.guildId,
      user_id: interaction.user.id
    })

    

    const erroEmbed = new EmbedBuilder().setTitle("Система браков")
                  .setDescription("У выбранного пользователя уже имеется партнёр")
    const requestEmbed = new EmbedBuilder().setTitle("Система браков")
                      .setDescription(`Уважаемый пользователь <@${target.user.id}>, хотите ли вы заключить брак с пользователем <@${interaction.user.id}>?`)
                      .setImage("https://i.pinimg.com/originals/6a/fe/22/6afe2295e4523d5bc8bd4027887e4c06.gif")
    
    const acceptEmbed = new EmbedBuilder().setTitle("Система браков")
                      .setDescription("Я - как посланник моего разработчика, объявляю ваш брак успешным. Пусть в вашей дальнейшей совместной жизни будет много счастья и любви!")
                      .setImage("https://i.pinimg.com/originals/7c/77/f8/7c77f8d1a4ced504204a54774abec72f.gif")
    const cancelEmbed = new EmbedBuilder().setTitle("Система браков")
                        .setDescription("Видимо, сегодня вам не светит быть в браке :(")

    if (interaction.user.id === targetUser.user.id) {
      return await interaction.reply({content: "Такого делать нельзя", ephemeral: true})
    }

    if (user !== null) {
      if (user.married) {
        await interaction.reply({embeds: [erroEmbed]});
      } else {
        await interaction.reply({embeds: [requestEmbed]})
      }
    }
  },
};
