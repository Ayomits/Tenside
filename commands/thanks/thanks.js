const { SlashCommandBuilder } = require("@discordjs/builders");
const {CommandInteraction, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle} = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
        .setName("celebrate")
        .setDescription("Поздравить с новым годом")
        .addUserOption(option => 
          option.setName('target').setDescription('target user').setRequired(true)),
  

  /**
   * 
   * @param {CommandInteraction} interaction 
   */

  async execute(interaction) {
    const modal = new ModalBuilder()
                  .setTitle('Ваше поздравление')
                  .setCustomId('congrasulations')
    
    const user = interaction.options.getUser("target")

    const congrasulation = new ActionRowBuilder().addComponents(
      new TextInputBuilder()
          .setCustomId('congrasulation')
          .setLabel("Ваше поздравление")
          .setPlaceholder("Хочу чтобы у моего брата был...")
          .setStyle(TextInputStyle.Paragraph)
          .setMaxLength(500)
    )

    const anonym = new ActionRowBuilder().addComponents(
      new TextInputBuilder()
          .setCustomId('anonym')
          .setLabel("Анонимно?")
          .setPlaceholder("Да/Нет (чётко укажите)")
          .setStyle(TextInputStyle.Short)
          .setMaxLength(3)
    )

    const forUser = new ActionRowBuilder().addComponents(
      new TextInputBuilder()
          .setCustomId('forUser')
          .setLabel("айди друга")
          .setValue(user.id)
          .setPlaceholder("738760081134452900")
          .setStyle(TextInputStyle.Short)
    )
    
    modal.addComponents(forUser, congrasulation, anonym)

    await interaction.showModal(modal)
  }
}