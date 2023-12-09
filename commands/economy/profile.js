const { CommandInteraction, AttachmentBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { userModel } = require("../../models/users");
const { createCanvas, loadImage } = require("canvas");
const path = require("path");



module.exports = {
  data: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("профиль пользователя")
    .addUserOption((option) =>
      option.setName("target").setDescription("target user").setRequired(false)
    ),

  /**
   * @param {CommandInteraction} interaction
   */

  async execute(interaction) {
    await interaction.deferReply();
    const targetUser = interaction.options.get("target");

    const user = targetUser ? targetUser.user : interaction.user;

    const userData = await userModel.findOne({
      guild_id: interaction.guildId,
      user_id: user.id,
    });


    if (!userData)
      return await interaction.channel.send({
        content: "Такой пользователь не найден",
      });

    const canvas = createCanvas(1920, 1080);
    const ctx = canvas.getContext("2d");
    
    ctx.font = "30px Sans";
    ctx.fillStyle = "#abb4cc"; // #5b647f

    const avatarURL = user.displayAvatarURL({ extension: "png", size: 128 })
    const member = interaction.client.guilds.cache.get(interaction.guildId).members.cache.get("935048996722978896")
    
    const background = await loadImage(path.resolve("profile.png"));
    const avatar = await loadImage(avatarURL);
    const memberAvatar = await loadImage(member.displayAvatarURL({extension: 'png', size: 128}))

    ctx.drawImage(background, 0 , 0, canvas.width, canvas.height);
    this.roundImage(838, 228, 238, ctx, avatar)  // аватарка юзера
    this.roundImage(1445, 540, 218, ctx, memberAvatar) // аватарка брака
    // ctx.fillText(userData.balance, 1550, 350) // balance

    ctx.fillText("Баланс", 270, 510) // баланс
    ctx.fillText(Math.floor(userData.balance), 390, 510) // баланс
    ctx.fillText(userData.voiceActive, 380, 704) // активность в войсе
    ctx.fillText(userData.reputation, 450, 898) // репутация
    ctx.fillText(userData.messageCount, 450, 799) // количество сообщений
    ctx.fillText("Партнёр", 1495, 500)
    ctx.fillText(member.user.username, 1495, 800) // юзернейм чела в браке
    ctx.fillText(Date.now(), 1500, 350) // просто таймстемп для приличия


    await interaction.editReply({
      files: [
        new AttachmentBuilder()
          .setFile(canvas.toBuffer())
          .setName("profile.png"),
      ],
    });
  },

  roundImage (x, y, size, ctx, avatar) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatar, x, y, size, size);
    ctx.restore()
  } 
};
