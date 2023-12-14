"use strict";
const { TextChannel, GuildMember } = require("discord.js");
const fs = require('fs');
const path = require("path");
/**
 *
 * @param {TextChannel} channel
 * @param {GuildMember} ticketUser
 */
async function toHtml(channel, ticketUser) {
    let start = Date.now();
    const messages = await channel.messages.fetch();
    let htmlString = await fs.promises.readFile(path.resolve("baseTicketLogTemplate.html"), "utf-8");
    htmlString += `<p class="title">Тикет пользователя ${ticketUser.username}</p>\n <div class="chat">`;
    messages.reverse().forEach(async (message) => {
        if (message.author.id === ticketUser.id) { // написавший в тикет
            htmlString += `<div class="message"> 
      <div class="user_avatar_div">
      <img class="user_avatar" src="${ticketUser.avatarURL()}">
      </div>`;
            htmlString += `
            <div class="user_agent">
            <div class="user_data">
                <span class="user_name">${ticketUser.username}</span>
                <span class="time">${message.createdAt}</span>
            </div>
            <div class="msg">
                <span class="user_msg">${message.content}</span>
            </div>
        </div>
      </div>
      `;
        }
        else if (message.author.bot && message.embeds.length > 0) { // bot
            const embed = message.embeds[0];
            htmlString += `<div class="message" id="msg_2">
                <div class="user_avatar_div">
                    <img class="user_avatar" src="${message.author.avatarURL()}">
                </div>
                <div class="user_agent">
                    <div class="user_data">
                        <span class="user_name">${message.author.username}</span>
                        <span class="bot">BOT</span>
                        <span class="time">${message.createdAt}</span>
                    </div>
                    <div class="msg">
                        <span class="user_msg embed embed_sieze">${embed.title}</span> <br>
                        <span class="user_msg embed description_size">${embed.description}</span> <br>
                    </div>
                </div>
            </div>`;
        }
        else if (!message.author.bot && message.author.id != ticketUser.id) { //support
            htmlString += `
      <div class="message" id="msg_7">
      <div class="user_avatar_div">
          <img class="user_avatar" src="${message.author.avatarURL()}">
      </div>
      <div class="user_agent">
          <div class="user_data">
              <span class="user_name">${message.author.username}</span>
              <span class="support">Отвечающий</span>
              <span class="time">${message.createdAt}}</span>
          </div>
          <div class="msg">
              <span class="user_msg">${message.content}</span>
          </div>
      </div>
  </div>`;
        }
    });
    htmlString += ` </div></body></html>`;
    console.log((Date.now() - start) / 1000);
    return htmlString;
}
module.exports = { toHtml };
