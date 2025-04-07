// Импорт
import { Markup } from "telegraf";

// Клавиатура "Участие в акции"
export function chanelKeyboard(promotion, counter = null) {
    const text = `${promotion.requires_subscription ? '🌟 ' : ''}Участвовать${counter ? ` (${counter})` : ''}`;
    const url = `https://your-webapp.com/?promotionId=${promotion._id}`; // ссылка на твой WebApp

    return {
        reply_markup: {
            inline_keyboard: [[
                {
                    text,
                    web_app: {
                        url,
                        request_write_access: true
                    }
                }
            ]]
        }
    };
}