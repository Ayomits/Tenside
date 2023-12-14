import { Interaction } from "discord.js"

export const getChannel = async (model: any, interaction: Interaction) => {
  let channelId = ""
    await model.findOne({guild_id: interaction.guildId}).then(async (result: any) => {
      channelId = result.channel_id
    }).catch(() => {
      channelId = "отсутствует"
    })

    return channelId
}