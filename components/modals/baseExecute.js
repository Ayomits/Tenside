const { ModalSubmitInteraction, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder } = require('discord.js')
const { systemAnketaQuestion, systemAnketaRecrutChannel } = require('../../models/system_message/models')

/**
 * 
 * @param {String} customId 
 */

const baseModal = async (customId, question1, question2, interaction) => {
  const modal = new ModalBuilder()
      .setTitle("Заявка в стафф")
      .setCustomId(customId)
  
  const aboutName = new ActionRowBuilder().addComponents(
    new TextInputBuilder()
        .setLabel("Ваше имя, возраст?")
        .setCustomId('aboutName')
        .setRequired(true)
        .setPlaceholder("Ален 18 лет")
        .setStyle(TextInputStyle.Short)
  )
  const aboutExperience = new ActionRowBuilder().addComponents(
    new TextInputBuilder()
        .setLabel("Был ли опыт на этой должности")
        .setCustomId('aboutExp')
        .setRequired(true)
        .setPlaceholder("2 года на проекте..")
        .setStyle(TextInputStyle.Short)
  )
  const whyYou = new ActionRowBuilder().addComponents(
    new TextInputBuilder()
        .setCustomId("whyYou")
        .setLabel("Почему именно вы?")
        .setPlaceholder("Потому что я Ален...")
        .setRequired(true)
        .setStyle(TextInputStyle.Paragraph)
  )
  const question1_ = new ActionRowBuilder().addComponents(
    new TextInputBuilder()
        .setCustomId("question1")
        .setLabel(question1)
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true)
  )

  const question2_ = new ActionRowBuilder().addComponents(
    new TextInputBuilder()
        .setCustomId("question2_")
        .setLabel(question2)
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true)
  )

  modal.addComponents(aboutExperience, aboutName, whyYou, question1_, question2_)
  await interaction.client.modals.set(customId, modal)
  await interaction.showModal(modal)
}

/**
 * 
 * @param {ModalSubmitInteraction} interaction 
 */



async function execute(interaction) {
  let question1
  let question2
  const embed = new EmbedBuilder()
                .setTitle(`Заявка от пользователя ${interaction.user.username}`)
  const questions = systemAnketaQuestion.findOne({type: interaction.customId}).then(async (result) => {
    question1 = result.dataValues.question1
    question2 = result.dataValues.question2

    const age = `Ваш возраст, имя?\n ` + "```" + `${interaction.fields.getTextInputValue("aboutName")}` + "```"
    const exp = `Опыт на должности?\n` + "```" + `${interaction.fields.getTextInputValue("aboutExp")}` + "```"
    const whyYou = `Почему именно вы \n` + "```" + `${interaction.fields.getTextInputValue("whyYou")}` + "```"
    const question1_ = `${question1}\n` + "```" + `${interaction.fields.getTextInputValue("question1")}` + "```"
    const question2_ = `${question2}\n` + "```" + `${interaction.fields.getTextInputValue("question1")}` + "```"
    
    const description = age + exp + whyYou + question1_ + question2_
    embed.setDescription(description)
    
    await systemAnketaRecrutChannel.findOne({guild_id: interaction.guildId}).then(async (result) => {
      const channel = interaction.client.channels.cache.get(result.dataValues.channel_id)
      await channel.send({embeds: [embed]})
      await interaction.reply({content: "Ваша анкета успешно отправлена, ждите ответа!", ephemeral: true})
    })
  })

} 

module.exports = {baseModal, execute}