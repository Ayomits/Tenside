const { ChannelSelectMenuInteraction, ActionRowBuilder, TextInputBuilder, ModalBuilder, TextInputStyle, EmbedBuilder, ModalSubmitInteraction } = require("discord.js");
const { systemAnketaRecrutChannel } = require("../../models/system_message/models");


const baseModal = async (customId, question1, question2, placeholder1, placeholder2,  interaction) => {
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
        .setPlaceholder(placeholder1)
  )

  const question2_ = new ActionRowBuilder().addComponents(
    new TextInputBuilder()
        .setCustomId("question2_")
        .setLabel(question2)
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true)
        .setPlaceholder(placeholder2)
  )

  modal.addComponents(aboutExperience, aboutName, whyYou, question1_, question2_)
  await interaction.showModal(modal)
}

/**
 * 
 * @param {ModalSubmitInteraction} interaction 
 */

const baseCallback = async (interaction) => {
  const embed = new EmbedBuilder().setTitle(`Вакансия от ${interaction.user.username}`)
  
  await systemAnketaRecrutChannel.findOne({where: {guild_id: interaction.guildId}}).then((result) => {
    const channel = interaction.client.channels.cache.get(result.dataValues.channel_id)
    console.log(interaction.fields.fields.values);
  })
}


module.exports = {
  customId: "vacansiesSelect",

  /**
   * @param { ChannelSelectMenuInteraction } interaction
   */

  async execute(interaction) {
    const values = interaction.values[0];
    
    switch (values){
      case "vedushiy":
        await baseModal("vedushiy", "Ваш опыт в бункере/мафии?", "Вы знаете правила этих игр?", "да, был, проводил...", "да, знаю, красные-мир, черные-маф", interaction)
        break
      case "closer":
        await baseModal("closer", "Какую игру хотите проводить?", "Когда вам удобно проводить клозы?", " (DOTA/VALORANT/другие)", "С 10 до 12", interaction)
        break
      case "control":
        await baseModal("control", "Сколько часов сможете уделять серверу?", "Расскажите о себе", "2 часа в день", "Ален, разработчик", interaction)
        break
      case "creative":
        await baseModal("creative", "Выбери направление", "Расскажи о себе", " Музыканты|Дабберы|Чтецы|Кинотеатр", "Ален, разработчик", interaction)
        break
    }
    
  }
};
