// Импорт
import { Markup } from "telegraf";

// Клавиатура "Участие в акции"
export function chanelKeyboard(promotionId, counter = null) {
    return Markup.inlineKeyboard([
        [Markup.button.url(`Участвовать ${counter ? `(${counter})` : ''}`, `https://t.me/asfasfsffsafasfsfasfsf_bot?startapp=${promotionId}`)]
    ]);
}