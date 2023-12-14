import { ActionRowBuilder,
  TextInputBuilder,
  ModalBuilder,
  TextInputStyle,
  EmbedBuilder,
  ChannelSelectMenuInteraction, ModalSubmitInteraction, TextInputComponent, ActionRowComponent, ActionRow}
 from "discord.js"
import {systemAnketaRecrutChannel} from "../models/system_message"



export const baseModal = async (
  customId: string,
  question1: string,
  question2: string,
  placeholder1: string,
  placeholder2: string,
  interaction: ChannelSelectMenuInteraction
) => {
  const modal = new ModalBuilder()
    .setTitle("Заявка в стафф")
    .setCustomId(customId);

  const aboutName = new ActionRowBuilder().addComponents(
    new TextInputBuilder()
      .setLabel("Ваше имя, возраст?")
      .setCustomId("Ваше имя, возраст?")
      .setRequired(true)
      .setPlaceholder("Ален 18 лет")
      .setStyle(TextInputStyle.Short)
  );
  const aboutExperience = new ActionRowBuilder().addComponents(
    new TextInputBuilder()
      .setLabel("Был ли опыт на этой должности")
      .setCustomId("Был ли опыт на этой должности")
      .setRequired(true)
      .setPlaceholder("2 года на проекте..")
      .setStyle(TextInputStyle.Short)
  );
  const whyYou = new ActionRowBuilder().addComponents(
    new TextInputBuilder()
      .setCustomId("Почему именно вы?")
      .setLabel("Почему именно вы?")
      .setPlaceholder("Потому что я Ален...")
      .setRequired(true)
      .setStyle(TextInputStyle.Paragraph)
  );
  const question1_ = new ActionRowBuilder().addComponents(
    new TextInputBuilder()
      .setCustomId(question1)
      .setLabel(question1)
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true)
      .setPlaceholder(placeholder1)
  );

  const question2_: any = new ActionRowBuilder().addComponents(
    new TextInputBuilder()
      .setCustomId(question2)
      .setLabel(question2)
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true)
      .setPlaceholder(placeholder2)
  );

  modal.addComponents(
    aboutExperience, aboutName, whyYou, question1_, question2_
  );
  await interaction.showModal(modal);
};

/**
 *
 * @param {ModalSubmitInteraction} interaction
 */

export const baseCallback = async (interaction: ModalSubmitInteraction) => {
  const embed = new EmbedBuilder().setTitle(
    `Вакансия от ${interaction.user.username} на должность ${interaction.customId}`
  );
  
  const fields = interaction.fields.fields
  let description = ``

  for (let field of fields) {
    const inputForm = field[1]
    description += `### **${inputForm.customId}**` + "```" + `${inputForm.value}` + "```\n"
  }

  embed.setDescription(description)
  embed.setFooter({iconURL: interaction.user.displayAvatarURL(), text: interaction.user.username})
  embed.setColor("#2F3136")
  embed.setTimestamp(Date.now())

  await systemAnketaRecrutChannel
    .findOne({ guild_id: interaction.guildId })
    .then(async (result: any ) => {
      const channel: any = interaction.client.channels.cache.get(
        result.channel_id
      );
      await interaction.reply({content: "Ваша заявка успешно отправлена. Администрация её рассмотрит и отправит вам ответ!", ephemeral: true})
      await channel.send({embeds: [embed]})
    });
};
