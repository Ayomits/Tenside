const {
    CommandInteraction,
    EmbedBuilder,
    PermissionFlagsBits,
  } = require("discord.js");
  const { SlashCommandBuilder } = require("@discordjs/builders");
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName("avatar")
      .setDescription("Аватарка и баннер пользователя")
      .addStringOption((option) =>
        option
          .setName("type")
          .setDescription("type of avatar")
          .addChoices(
            {
              name: "display",
              value: "display",
            },
            {
              name: "profile",
              value: "profile",
            }
          )
          .setRequired(true)
      )
      .addUserOption((option) =>
        option
          .setName("target")
          .setDescription("Нужный пользователь")
          .setRequired(false)
      ),
  
    /**
     *
     * @param {CommandInteraction} interaction
     *
     */
  
    async execute(interaction) {
        const color = '#36393F';
        const targetUser = interaction.options.getUser("target") || interaction.user;
        const type = interaction.options.get('type').value
        const guild = interaction.guild;
        const member = await guild.members.fetch(targetUser.id)

        const bannerUrl = (await member.fetch()).user.bannerURL({size: 4096})
        const avatarUrl = type !== "display" ? targetUser.displayAvatarURL({size: 2048}) :  member.displayAvatarURL({size: 2048})

        const avatarEmbed = new EmbedBuilder()
                            .setAuthor({ iconURL: avatarUrl, name: member.user.username })
                            .setImage(avatarUrl)
                            .setTimestamp(Date.now())
                            .setColor(color)

        const bannerEmbed = new EmbedBuilder().setTimestamp(Date.now()).setColor(color)

        !bannerUrl
            ?bannerEmbed.setDescription("У пользователя нет баннера")
            :bannerEmbed.setImage(bannerUrl)

        await interaction.reply({embeds: [avatarEmbed, bannerEmbed], ephemeral: true})
      }  
}