const { CommandInteraction, EmbedBuilder, PermissionFlagsBits, Embed, ChannelType } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const fs = require("fs");
const path = require("path");
const { channel } = require("diagnostics_channel");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("online")
        .setDescription("Посчитать онлайн в войсах"),


    /**
   *
   * @param {CommandInteraction} interaction
   *
   */

    async execute(interaction) {
        let description = ""
        let users = []
        let members = 0
        

        const embed = new EmbedBuilder()
            .setTitle(`Онлайн в войсе`)

        interaction.guild.channels.cache.filter(channel => channel.type === ChannelType.GuildVoice).forEach(channel => {
            if (channel.members.size !== 0 && channel.id != 1186934799517102181) {
                description += `> - <#${channel.id}> - `
                channel.members.forEach(async member => {
                    description += `<@${member.user.id}> `
                    members += 1
                    console.log(description)
                })
                description += `\n`
            }
        })

        description += `### **Всего людей в голосовых каналах:** \`${members}\` \n`

        if (members > 20) {
            description += `> \`\`\`Так как в голосовых каналах больше 20 людей, пользователи недоступны.\`\`\``
        } else if (members == 0) {
            description += `> \`\`\`В войсах нет ни единой души. Может, тебе стоит зайти и поболтать с кем то?\`\`\``
        }
        embed.setDescription(description)
        interaction.reply({embeds: [embed], ephemeral: true});
    },
};