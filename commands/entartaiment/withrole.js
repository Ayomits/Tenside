const { CommandInteraction, EmbedBuilder, PermissionFlagsBits, Embed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("withrole")
        .setDescription("Найти пользователей с определённой ролью")
        .addRoleOption((option) =>
            option.setName("role").setDescription("Выберите роль").setRequired(true)
        ),


    /**
   *
   * @param {CommandInteraction} interaction
   *
   */

    async execute(interaction) {
        const role = interaction.options.getRole("role")
        let description = ``

        const embed = new EmbedBuilder()
            .setTitle(`Поиск людей по ролям (${role.name})`)

        if (!role) {
            return interaction.reply({content: 'Такой роли нет! Возможно, вы ошиблись номером?', ephemeral: true});
        }

        const membersWithRole = interaction.guild.members.cache.filter(member => member.roles.cache.has(role.id));
        const memberList = membersWithRole.map(member => `<@${member.id}>`).join(', ');
        if (membersWithRole.size > 20) {
            description += `\`\`\`Участников с данной ролью больше 20 (${membersWithRole.size}). Попробуйте другую роль.\`\`\` \n`
        } else {
            description += membersWithRole.size != 0 ? `> ${memberList}` : `\`\`\`Ой-ой! Похоже, участников с такой ролью нет! Попробуйте проверить другую роль\`\`\``
        }
        embed.setDescription(description)

        interaction.reply({embeds: [embed], ephemeral: true});
    },
};