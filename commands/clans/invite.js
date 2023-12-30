const {
  CommandInteraction, EmbedBuilder, ActionRowBuilder, TextInputBuilder, ButtonBuilder, ButtonStyle, ComponentType
} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const {clanModel} = require('../../models/clans')


module.exports = {
  data: new SlashCommandBuilder()
        .setName('invite-clan')
        .setDescription('пригласить в клан')
        .addUserOption(option => 
              option.setName('target').setDescription('target user').setRequired(true)),
  /**
   * @param {CommandInteraction} interaction
   */

  async execute(interaction) {
    const targetUser = interaction.options.getMember('target')

    const canInvite = await clanModel.findOne({
      $or: [
        { clanDeputy: { $in: [interaction.user.id] } },
        { clanOwner: interaction.user.id }
      ]
    });

    if (canInvite === null) {
      return await interaction.reply({content: "Вы не являетесь заместителем или главой клана, либо у вас нет клана", ephemeral: true})
    }

    const clanMember = await clanModel.findOne({guild_id: interaction.guildId,  clanMembers: { $in: [targetUser.user.id] }})
    if (clanMember !== null) {
      return await interaction.reply({content: "Участник находится в клане " + clanMember.clanName})
    }

    if (canInvite.clanMembers.length + 1 > canInvite.clanMaxSlots){
      return await interaction.reply({content: "У вас переполнены слоты в клане", ephemeral: true})
    }

    
    
    const embed = new EmbedBuilder()
                  .setTitle("Приглашение в клан " + canInvite.clanName)
                  .setDescription(`Пользователь <@${interaction.user.id}> приглашает вас в клан ${canInvite.clanName}. \n Вы согласны вступить? На ответ есть 30 секунд`)
                  
    const clanRequest = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
          .setCustomId('acceptInvite')
          .setLabel('Принять')
          .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId('cancelInvite')
        .setLabel('Отклонить')
        .setStyle(ButtonStyle.Danger)
    )

   const replyMessage =  await interaction.reply({content: `<@${targetUser.user.id}>`, embeds: [embed], components: [clanRequest]})

    let isClicked = false

    interaction.channel.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 30_000
    }).on('collect', async (inter) => {
        if (inter.user.id === targetUser.user.id && inter.customId === 'acceptInvite') {
          try{
            await clanModel.updateOne({clanName: canInvite.clanName, guild_id: inter.guildId}, {$push: {clanMembers: targetUser.user.id}})
            await targetUser.roles.add(canInvite.clanRole)
            await replyMessage.edit({components: [], embeds: [embed.setDescription(`Пользователь <@${targetUser.user.id}> принял ваше приглашение`)]})
            isClicked = true
          }catch(err) {
            isClicked = true
            await inter.reply({content: "Что-то пошло не так .. \n" +  err, ephemeral: true})
          }
        }else if (inter.user.id === targetUser.user.id && inter.customId === "cancelInvite") {
          isClicked = true
          await replyMessage.edit({components: [], embeds: [embed.setDescription(`Пользователь <@${targetUser.user.id}> отказался от вашего приглашения`)]})
        }
    }).on('end', async (inter) => {
      if (!isClicked) {
        try{
          await replyMessage.edit({components: [], embeds: [embed.setDescription(`Время истекло`)]})
        }catch {}
        
      }
    })
  }               
}