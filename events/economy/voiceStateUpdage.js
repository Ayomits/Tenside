const { Events, VoiceState, NewsChannel } = require("discord.js");
const {userModel} = require('../../models/users')


module.exports = {
  name: Events.VoiceStateUpdate,
  once: false,

  /**
   * @param {VoiceState} oldState
   * @param {VoiceState} newState
   */

  async execute(oldState, newState) {
    if (oldState.channelId && newState.channelId) {
      let intervalId = setInterval(async () => {
        if (!newState.channelId) {
          clearInterval(intervalId); // Остановить интервал
          return;
        }
        await userModel.updateOne({ guild_id: newState.guild.id, user_id: newState.member.id }, { $inc: { balance: 5 } });
      }, 5000);
    }
  }
}