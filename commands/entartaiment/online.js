const { CommandInteraction, EmbedBuilder, PermissionFlagsBits, Embed, ChannelType } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const fs = require("fs");
const path = require("path");

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
        let description = undefined
        let users = []

        const embed = new EmbedBuilder()
            .setTitle(`Онлайн в войсе`)

        interaction.guild.channels.cache.filter(channel => channel.type === ChannelType.GuildVoice).forEach(channel => {
            channel.members.forEach(async member => {
                users.push(member.user.id)
            })
        })

        description = `### **Всего людей в голосовых каналах:** \`${users.length}\` \n`

        if (users.length > 20) {
            description += `> \`\`\`Так как в голосовых каналах больше 20 людей, пользователи недоступны.\`\`\``
        } else if (users.length == 0) {
            description += `> \`\`\`В войсах нет ни единой души. Может, тебе стоит зайти и поболтать с кем то?\`\`\``
        } else {
            const reformat = users.map(Number => `<@${Number}>`).join('**,** ');
            description += `> **Участники:** ${reformat}`
        }
        embed.setDescription(description)
        interaction.reply({embeds: [embed], ephemeral: true});
    },
};