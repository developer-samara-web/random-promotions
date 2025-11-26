// Импорт
import { Markup } from "telegraf";

// Клавиатура "Участие в раздачи"
export function chanelKeyboard() {
    return Markup.inlineKeyboard([
        [Markup.button.url(`🚀 Получить доступ`, `${process.env.TELEGRAM_BOT_URL}?start=premium`)]
    ]);
}

export function chanelPrivateKeyboard(promotion, counter = null) {
    return Markup.inlineKeyboard([
        [Markup.button.url(`${promotion.is_private ? '🌟 ' : ''}Участвовать ${counter ? `(${counter})` : ''}`, `${process.env.TELEGRAM_BOT_URL}/webapp?startapp=${promotion._id}`)]
    ]);
}

export function resultKeyboard(promotion) {
    return Markup.inlineKeyboard([
        [Markup.button.url(`🔥 Результаты`, `${process.env.TELEGRAM_BOT_URL}/webapp?startapp=${promotion._id}`)]
    ]);
}