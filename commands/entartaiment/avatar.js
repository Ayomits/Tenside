const { CommandInteraction, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const fs = require("fs");
const path = require("path");
const img = `https://i.imgur.com/i3Y3gQF.png`

module.exports = {
    data: new SlashCommandBuilder()
        .setName("avatar_test")
        .setDescription("test")
        .addUserOption((option) =>
            option.setName("target").setDescription("target user").setRequired(false)
        ),

    /**
   *
   * @param {CommandInteraction} interaction
   *
   */

    async execute(interaction) {
        let target = null;
        if (interaction.options.get("target") == null) {
            target = await interaction.user.fetch();
        } else {
            target = await interaction.options.get("target").user.fetch();
        }
        const inter_avatar = interaction.user.displayAvatarURL();
        const bannerURL = target.bannerURL({ size: 4096 });
        console.log(target.id);
        console.log(target.displayAvatarURL());
        const avatarEmbed = new EmbedBuilder()
            .setColor("#36393F")
            .setAuthor({ iconURL: target.displayAvatarURL(), name: target.username })
            .setImage(target.displayAvatarURL({ size: 4096 }));
        let bannerEmbed = null;
        if (bannerURL != undefined) {
            bannerEmbed = new EmbedBuilder()
                .setColor("#36393F")
                .setImage(bannerURL)
                .setTimestamp(new Date());
        } else {
            bannerEmbed = new EmbedBuilder()
                .setColor("#36393F")
                .setDescription("У пользователя нет баннера")
                .setTimestamp(new Date());
        }
        await interaction.reply({
            embeds: [avatarEmbed, bannerEmbed],
            ephemeral: true,
        });
    },
};