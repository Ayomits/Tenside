const { Events, VoiceState } = require("discord.js");
const { userModel } = require("../../models/users");


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
      this.startInterval(userId, guildId, newState.client);
    } else {
      this.stopInterval(userId, newState.client);
    }
  },

  startInterval(userId, guildId, client) {
    if (!client.voiceUsers.has(userId)) {
      const interval = setInterval(async () => {
        await userModel.updateOne(
          { guild_id: guildId, user_id: userId },
          { $inc: { balance: 2, voiceActive: 60 } }
        );
        
      }, 60000);

      client.voiceUsers.set(userId, interval);

    }
  },

  stopInterval(userId, client) {
    if (client.voiceUsers.has(userId)) {
      clearInterval(client.voiceUsers.get(userId));
      client.voiceUsers.delete(userId);
    }
  },
};
