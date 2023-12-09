const { CommandInteraction, AttachmentBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { userModel, marryModel } = require("../../models/users");
const { createCanvas, loadImage, registerFont } = require("canvas");
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
    try {
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
    
    registerFont(path.resolve(__dirname, "impact.ttf"), { family: "Inter-Medium" });
    ctx.font = `33px "Inter-Medium"`
    ctx.fillStyle = "#5b647f"; // #5b647f

    const avatarURL = user.displayAvatarURL({ extension: "png", size: 128 })
    const marriedUser = await marryModel.findOne({
      guild_id: interaction.guildId,
      $or: [
        { partner1_id: user.id },
        { partner2_id: user.id }
      ]
    })

    let partner_id 
    let member 

    if (marriedUser) {
     partner_id = (marriedUser.partner1_id === user.id) ? marriedUser.partner2_id : marriedUser.partner1_id;

     member = interaction.client.guilds.cache.get(interaction.guildId).members.cache.get(partner_id)
    }
    
    const background = await loadImage(path.resolve("profile.png"));
    const avatar = await loadImage(avatarURL);
    let memberAvatar = member ? await loadImage(member.displayAvatarURL({ extension: 'png', size: 128 })) : await loadImage("https://cdn-icons-png.flaticon.com/512/25/25333.png")
    
    ctx.drawImage(background, 0 , 0, canvas.width, canvas.height);
    this.roundImage(838, 228, 238, ctx, avatar)  // аватарка юзера
    this.roundImage(1445, 540, 218, ctx, memberAvatar) // аватарка брака
    // ctx.fillText(userData.balance, 1550, 350) // balance

    ctx.fillText(Math.floor(userData.balance), 300, 510) // баланс
    ctx.fillText(userData.voiceActive, 380, 704) // активность в войсе
    ctx.fillText(userData.reputation, 450, 898) // репутация
    ctx.fillText(userData.messageCount, 450, 799) // количество сообщений
    ctx.fillText(!marriedUser ? "У пользователя нет брака" : this.getDate(marriedUser.created_at), 1450, 345) // просто таймстемп для приличия
    ctx.fillText("Система браков", 1450, 500)  

    await interaction.editReply({
      files: [
        new AttachmentBuilder()
          .setFile(canvas.toBuffer())
          .setName("profile.png"),
      ],
    });
  } catch (err) {
    console.log(err);
  }
  },

  roundImage (x, y, size, ctx, avatar) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatar, x, y, size, size);
    ctx.restore()
  }, 

  getDate(timestamp) {
    const date = new Date(Number(timestamp))

    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
}
};
