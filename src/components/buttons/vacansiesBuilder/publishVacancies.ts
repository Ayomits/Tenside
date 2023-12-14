import  {
  ButtonInteraction,
  EmbedBuilder,
  StringSelectMenuBuilder,
  ActionRowBuilder,
} from "discord.js"
import {
  systemMessageModel,
  systemAnketaEmbed,
  systemAnketaRecrutChannel,
} from "../../../models/system_message"
import { Button } from "../../../types";

function descTemplate (vacansiya: string) {
  return "Вы хотите подать на " + vacansiya
}

const button: Button = {
  customId: "publishVacancies",

  /**
   * @param {ButtonInteraction} interaction
   */

  async execute(interaction: ButtonInteraction) {
    const channel_id = await systemMessageModel.findOne({
        guild_id: interaction.guildId,
    });
    if (channel_id) {
      const channelId = channel_id.channel_id
      const channel: any = interaction.guild?.channels?.cache.get(channelId);
      const fields: any = await systemAnketaEmbed.findOne({ guild_id: interaction.guildId },
      );
      if (fields) {
        const embed1 = new EmbedBuilder()
                      .setImage(fields.imageLink)
                      .setColor(fields.color)
        const embed2 = new EmbedBuilder()
          .setTitle(fields.title)
          .setDescription(fields.description)
          .setColor(fields.color)
        

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

export default button