// Импорт
import { Markup } from "telegraf";

// Клавиатура "Участие в раздачи"
export function chanelKeyboard(promotion, counter = null) {
    return Markup.inlineKeyboard([
        [Markup.button.url(`${promotion.requires_subscription ? '🌟 ' : ''}Участвовать ${counter ? `(${counter})` : ''}`, `${process.env.TELEGRAM_BOT_URL}?startapp=${promotion._id}`)]
    ]);
}