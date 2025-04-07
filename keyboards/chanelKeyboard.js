// Импорт
import { Markup } from "telegraf";

// Клавиатура "Участие в акции"
export function chanelKeyboard(promotion, counter = null) {
    return Markup.inlineKeyboard([
        [Markup.button.url(`${promotion.requires_subscription ? '🌟 ' : ''}Участвовать ${counter ? `(${counter})` : ''}`, `https://t.me/asfasfsffsafasfsfasfsf_bot?startapp=${promotion._id}`)]
    ]);
}