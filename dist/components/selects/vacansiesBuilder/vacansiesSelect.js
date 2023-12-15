"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseExecute_1 = require("../../../functions/baseExecute");
const button = {
    customId: "vacansiesSelect",
    /**
     * @param { ChannelSelectMenuInteraction } interaction
     */
    async execute(interaction) {
        const values = interaction.values[0];
        switch (values) {
            case "vedushiy":
                await (0, baseExecute_1.baseModal)("vedushiy", "Ваш опыт в бункере/мафии?", "Вы знаете правила этих игр?", "да, был, проводил...", "да, знаю, красные-мир, черные-маф", interaction);
                break;
            case "closer":
                await (0, baseExecute_1.baseModal)("closer", "Какую игру хотите проводить?", "Когда вам удобно проводить клозы?", " (DOTA/VALORANT/другие)", "С 10 до 12", interaction);
                break;
            case "control":
                await (0, baseExecute_1.baseModal)("control", "Сколько часов сможете уделять серверу?", "Расскажите о себе", "2 часа в день", "Ален, разработчик", interaction);
                break;
            case "creative":
                await (0, baseExecute_1.baseModal)("creative", "Выбери направление", "Расскажи о себе", " Музыканты|Дабберы|Чтецы|Кинотеатр", "Ален, разработчик", interaction);
                break;
            case "eventer":
                await (0, baseExecute_1.baseModal)("eventer", "Сколько ивентов можете провести в день?", "У вас есть 2FA?", "5-6 ивентов в день. Манчкин...", "Да/нет?", interaction);
            case "media":
                await (0, baseExecute_1.baseModal)("media", "У вас есть 2FA?", "Где будете распространять сервер?", "Да/нет", "На http://example.com и ...", interaction);
            case "designer":
                await (0, baseExecute_1.baseModal)("designer", "Умеете делать GIF аватары?", "У вас есть 2FA?", "http://example.com", "Да/Нет", interaction);
            case "pm":
                await (0, baseExecute_1.baseModal)("pm", "Сколько партнёрок в день?", "У вас есть 2FA?", "5-6 в день...", "Да/Нет?", interaction);
            case "support":
                await (0, baseExecute_1.baseModal)("support", "Оцените свое знание правил 1/10", "У вас есть 2FA?", "10/10", "Да/нет", interaction);
        }
    },
};
exports.default = button;
