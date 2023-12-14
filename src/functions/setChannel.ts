import {EmbedBuilder, ChannelSelectMenuInteraction} from 'discord.js'


/**
 * 
 * @param {ChannelSelectMenuInteraction} interaction 
 * @param {Model} model 
 * @param {String} system 
 */

export async function setChannel(interaction: ChannelSelectMenuInteraction, model: any, system: string) {
  try {
    const values = interaction.values[0]
    const UpdatedRows = await model.updateOne({guild_id: interaction.guildId}, {channel_id: values}, { upsert: true, new: true })

    let embed = new EmbedBuilder()
                .setTitle(`Настройка ${system}`)
                .setFooter({iconURL: interaction.user.displayAvatarURL(), text: interaction.user.username})
                .setColor("#2F3136")

    if (UpdatedRows) {
      embed.setDescription(`Ваш канал <#${values}>`)
      await interaction.message.edit({embeds: [embed]})
      await interaction.reply({content: `канал для ${system} успешно обновлён в базе данных`, ephemeral: true})
    } else {
      await model.create({guild_id: interaction.guildId, channel_id: values})
      embed.setDescription(`Ваш канал <#${values}>`)
      await interaction.message.edit({embeds: [embed]})
      await interaction.reply({content: `канал для ${system} успешно создан в базе данных`, ephemeral: true})
    }
  }catch (err: any) {
    console.log(err);
  }
}
