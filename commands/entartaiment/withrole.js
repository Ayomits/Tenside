const { CommandInteraction, EmbedBuilder, PermissionFlagsBits, Embed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const fs = require("fs");
const path = require("path");
const img = `https://i.imgur.com/i3Y3gQF.png`

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

        const embed = new EmbedBuilder()
            .setTitle("Люди с ролью")

        if (!role) {
            return interaction.reply('Такой роли нет! Возможно, вы ошиблись номером?');
        }

        const membersWithRole = interaction.guild.members.cache.filter(member => member.roles.cache.has(role.id));
        const memberList = membersWithRole.map(member => member.user.tag).join(', ');

        interaction.reply(`Участники с ролью ${role.name}: ${memberList}`);
    },
};