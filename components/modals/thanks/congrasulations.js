const {ModalSubmitInteraction, EmbedBuilder} = require('discord.js')
const { userModel } = require('../../../models/users')


module.exports = {
  customId: "congrasulations",

  /**
   * @param {ModalSubmitInteraction} interaction
   */

  async execute(interaction) {
    const user = await userModel.findOne({guild_id: interaction.guildId, user_id: interaction.user.id})

    if (user.balance < 500) {
      return await interaction.reply({content: "У вас недостаточно средств", ephemeral: true})
    }else {
      const congrasulation = interaction.fields.getField('congrasulation').value
      const anonym = interaction.fields.getField('anonym').value
      const forUser = interaction.fields.getField('forUser').value
      const member = interaction.guild.members.cache.get(forUser)
      const anonymAvatar = "https://cdn.vectorstock.com/i/preview-1x/96/75/avatar-9-vector-32409675.jpg"
      const validAnswers = ["да", "нет"]
      if (!member) return await interaction.reply({content: "Укажите правильный айди вашего друга", ephemeral: true})
      if (!validAnswers.includes(anonym.toLowerCase())) return await interaction.reply({content: "Введите валидное значение в поле анонимность", ephemeral: true})
      
      const embed = new EmbedBuilder()
                    .setDescription(congrasulation)
                    .setTitle(`Поздравление от ${anonym.toLowerCase() === "да" ? "анонима" : interaction.user.username}`)
                    .setColor("#36393F")
                    .setTimestamp(Date.now())
                    .setFooter({text: `${anonym.toLowerCase() === "да" ? "аноним  " : interaction.user.username}`, iconURL: `${anonym.toLowerCase() === "да" ? anonymAvatar : interaction.user.displayAvatarURL()}`})

      const congrasulationChannel = interaction.guild.channels.cache.get("1190353019691343923")
      const logChannel = interaction.guild.channels.cache.get("1190368136382394399")

      await interaction.reply({content: "Поздравление вашему другу отправлено в канал " + `<@${congrasulationChannel.id}>`, ephemeral: true})
      await user.updateOne({$inc: {balance: -500}})
      await logChannel.send({content: `Поздравление с контентом отправлено пользователем <@${interaction.user.id}>: \n` + "```" + `${congrasulation}` + "```"})
      return await congrasulationChannel.send({content: `<@${member.user.id}>`, embeds: [embed]})
      
    }
  }
}