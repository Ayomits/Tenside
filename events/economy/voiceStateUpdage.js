const { Events, VoiceState, NewsChannel } = require("discord.js");
const { userModel } = require("../../models/users");

let timeoutIds = new Map();

module.exports = {
  name: Events.VoiceStateUpdate,
  once: false,

  /**
   * @param {VoiceState} oldState
   * @param {VoiceState} newState
   */

  async execute(oldState, newState) {
    const userId = newState.member.id;
    const guildId = newState.guild.id;

    if (newState.channelId) {
      if (timeoutIds.has(userId)) {
        this.deleteIntervals(userId);
        this.startInteraval(userId, guildId);
      } else {
        this.startInteraval(userId, guildId);
      }
    } else {
      this.deleteIntervals(userId);
    }
  },

  startInteraval(userId, guildId) {
    const interval = setInterval(async () => {
      await userModel.updateOne(
        { guild_id: guildId, user_id: userId },
        { $inc: { balance: 5, voiceActive: 60 } }
      );
    }, 60_000);

    timeoutIds.set(userId, interval);
  },

  deleteIntervals(userId) {
    clearInterval(timeoutIds.get(userId));
    timeoutIds.delete(userId);
  },
};
