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
} = require("../../../models/system_message/models");

function descTemplate (vacansiya) {
  return "Вы хотите подать на " + vacansiya
}

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
                      .setImage(fields_.imageLink)
                      .setColor(fields_.color)
        const embed2 = new EmbedBuilder()
          .setTitle(fields_.title)
          .setDescription(fields_.description)
          .setColor(fields_.color)
        

        const select = new StringSelectMenuBuilder()
          .setCustomId("vacansiesSelect")
          .setPlaceholder("Выберите должность")
          .setOptions(
            {label: "Ведущий", value: "vedushiy", description: descTemplate("ведущий")},
            {label: "Closer", value: "closer", description: descTemplate("closer")},
            {label: "Creative", value: "creative", description: descTemplate("creative")},
            {label: "Control", value: "control", description: descTemplate("control")},
            {label: "Eventer", value: "eventer", description: descTemplate("eventer")},
            {label: "PR manager", value: "pm", description: descTemplate("пиар менеджера")},
            {label: "Designer", value: "designer", description: descTemplate("designer")},
            {label: "Media", value: "media", description: descTemplate("media")},
            {label: "Support", value: "support", description: descTemplate("support")}
          )

        try {
          await channel.send({
            components: [new ActionRowBuilder().addComponents(select)],
            embeds: [embed1 ,embed2]
          });
        } catch {
          await interaction.reply({
            content: "неизвестная ошибка undefined",
            ephemeral: true
          });
        }
      }else {
        await interaction.reply({content: "Не установлен эмбед. Обратите внимание, в поле image нужно ставить картинку, а не pornhub!!", ephemeral: true})
      }
    }
  },
};
