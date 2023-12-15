import { Client, Events, VoiceState } from "discord.js";

import {userModel} from '../../models/users'
import { BotEvent } from "../../types";

function startInterval(userId: string, guildId: string, client: Client) {
  if (!client.voiceUsers.has(userId)) {
    const interval = setInterval(async () => {
      await userModel.updateOne(
        { guild_id: guildId, user_id: userId },
        { $inc: { balance: 5, voiceActive: 60 } }
      );
      
    }, 60000);

    client.voiceUsers.set(userId, interval);

  }
}

function stopInterval(userId: string, client: Client) {
  if (client.voiceUsers.has(userId)) {
    clearInterval(client.voiceUsers.get(userId));
    client.voiceUsers.delete(userId);
  }
}

const voiceStateUpdate: BotEvent = {
  name: Events.VoiceStateUpdate,
  once: false,

  /**
   * @param {VoiceState} oldState
   * @param {VoiceState} newState
   */

  async execute(oldState: VoiceState, newState: VoiceState) {
    const userId = newState.member?.id;
    const guildId = newState.guild.id;

    if (newState.channelId) {
      startInterval(String(userId), guildId, newState.client);
    } else {
      stopInterval(String(userId), newState.client);
    }
  },
}



export default voiceStateUpdate