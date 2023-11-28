const {
  ChannelSelectMenuInteraction,
} = require('discord.js')

const {baseModal} = require('../modals/baseExecute')

module.exports = {
  customId: "vacansiesSelect",

  /**
   * @param { ChannelSelectMenuInteraction } interaction
   */

  async execute(interaction) {
    const values = interaction.values[0];

    switch (values) {
      case "vedushiy":
        await baseModal(
          "vedushiy",
          "Ваш опыт в бункере/мафии?",
          "Вы знаете правила этих игр?",
          "да, был, проводил...",
          "да, знаю, красные-мир, черные-маф",
          interaction
        );
        break;
      case "closer":
        await baseModal(
          "closer",
          "Какую игру хотите проводить?",
          "Когда вам удобно проводить клозы?",
          " (DOTA/VALORANT/другие)",
          "С 10 до 12",
          interaction
        );
        break;
      case "control":
        await baseModal(
          "control",
          "Сколько часов сможете уделять серверу?",
          "Расскажите о себе",
          "2 часа в день",
          "Ален, разработчик",
          interaction
        );
        break;
      case "creative":
        await baseModal(
          "creative",
          "Выбери направление",
          "Расскажи о себе",
          " Музыканты|Дабберы|Чтецы|Кинотеатр",
          "Ален, разработчик",
          interaction
        );
        break;
    }
  },
};
