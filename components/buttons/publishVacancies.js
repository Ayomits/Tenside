const {
  ButtonInteraction,
  EmbedBuilder,
  StringSelectMenuBuilder,
  ActionRowBuilder,
} = require("discord.js");
const {
  systemMessageModel,
  systemAnketaEmbed,
  systemAnketaQuestion,
  systemAnketaModalIDS,
  systemAnketaRecrutChannel,
} = require("../../models/system_message/models");

module.exports = {
  customId: "publishVacancies",

  /**
   * @param {ButtonInteraction} interaction
   */

  async execute(interaction) {
    const channel_id = await systemMessageModel.findOne({
      where: {
        guild_id: interaction.guildId,
      },
    });
    if (channel_id) {
      const channelId = channel_id.dataValues.channel_id;
      const channel = interaction.guild.channels.cache.get(channelId);
      const fields = await systemAnketaEmbed.findOne({
        where: { guild_id: interaction.guildId },
      });
      if (fields) {
        const fields_ = fields.dataValues;
        const embed1 = new EmbedBuilder()
                      .setTitle("ㅤ")
                      .setImage(fields_.imageLink)
        const embed2 = new EmbedBuilder()
          .setTitle(fields_.title)
          .setDescription(fields_.description)
          .setColor(fields_.color)
        
        

        const select = new StringSelectMenuBuilder()
          .setCustomId("vacansiesSelect")
          .setPlaceholder("Выберите должность")
          .setOptions(
            {label: "Ведущий", value: "vedushiy"},
            {label: "Closer", value: "closer"},
            {label: "Creative", value: "creative"},
            {label: "Control", value: "control"}
          )


        try {
          await channel.send({
            components: [new ActionRowBuilder().addComponents(select)],
            embeds: [embed1 ,embed2]
          });
        } catch {
          await interaction.reply({
            content: "неизвестная ошибка, видимо вы не создали вакансий",
            ephemeral: true
          });
        }
      }else {
        await interaction.reply({content: "Не установлен эмбед. Обратите внимание, в поле image нужно ставить картинку, а не pornhub!!", ephemeral: true})
      }
    }
  },
};
