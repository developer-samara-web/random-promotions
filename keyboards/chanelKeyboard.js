// Импорт
import { Markup } from "telegraf";

// Клавиатура "Участие в акции"
export function chanelKeyboard(promotion, counter = null) {
    return Markup.inlineKeyboard([
        [Markup.button.url(`${promotion.requires_subscription ? '🌟 ' : ''}Участвовать ${counter ? `(${counter})` : ''}`, `${process.env.TELEGRAM_BOT_URL}?startapp=${promotion._id}`)]
    ]);
}

// Клавиатура "Участие в акции"
export function winnerKeyboard() {
    return Markup.inlineKeyboard([
        [Markup.button.callback("🚀 Главное меню", "start_menu")]
    ]);
}