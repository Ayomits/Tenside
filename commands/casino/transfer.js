const {
  CommandInteraction,
  EmbedBuilder,
} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const {userModel} = require('../../models/users')
const casinoModel = require(`../../models/casino`)

module.exports = {
  data: new SlashCommandBuilder()
        .setName("casinotransfer")
        .setDescription("передача денег в казино")
     
        .addNumberOption((option) =>
        option.setName("amount").setDescription("Количество валюты для выдачи").setRequired(true)
        ),
  
  /**
   * @param {CommandInteraction} interaction
   */

  async execute(interaction) {
    const amount = interaction.options.get('amount').value

if (interaction.user.id == `935048996722978896`){return interaction.reply({ephemeral: true, content:`Недоступно!`})}
    const author = await userModel.findOne({guild_id: interaction.guildId, user_id: interaction.user.id})
    if (author.balance < amount) {
      return await interaction.reply({content: "Ты слишком беден для таких действий", ephemeral: true})
    }else {
      const user = await casinoModel.create({ guild_id: interaction.guild.id })
 

      if (user) {
        user.balance += amount
        user.save()
        author.balance -= amount
        author.save()

        const embed = new EmbedBuilder()
                    .setTitle("Перевод денег")
                    .setDescription(`Пользователь <@${author.user_id}> перевел ${amount} денег на баланс казино`)
                    .setFooter({iconURL: interaction.user.displayAvatarURL(), text: interaction.user.username})

        await interaction.reply({embeds: [embed]})
        
      }else {
        await casinoModel.create({ guild_id: interaction.guild.id })
        await interaction.reply({content: `попробуйте снова!`, ephemeral:true})

      
      }
    }
  }
}