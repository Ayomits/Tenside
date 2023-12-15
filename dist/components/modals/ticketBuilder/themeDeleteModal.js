"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tickets_1 = require("../../../models/tickets");
const button = {
    customId: "themeDeleteModal",
    /**
     *@param {ModalSubmitInteraction} interaction
     */
    async execute(interaction) {
        const themeId = interaction.fields?.getField('themeId').value;
        await tickets_1.TicketSettingsTheme.findOne({ theme_uniq_id: themeId.toLowerCase(), guild_id: interaction.guildId }).then(async (result) => {
            if (result === null) {
                await interaction.reply({ content: "Тема с этим id ещё не создана", ephemeral: true });
            }
            else {
                await tickets_1.TicketSettingsTheme.deleteOne({ theme_uniq_id: themeId.toLowerCase(), guild_id: interaction.guildId });
                await interaction.reply({ content: `Тема с id - ${themeId.toLowerCase()} успешно удалена`, ephemeral: true });
            }
        });
    }
};
exports.default = button;
