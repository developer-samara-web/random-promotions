// Импорт
import { Markup } from "telegraf";

// Клавиатура "Участие в акции"
export function chanelKeyboard(promotionId) {
    return Markup.inlineKeyboard([
        [Markup.button.url("Участвовать", `https://t.me/asfasfsffsafasfsfasfsf_bot?startapp=${promotionId}`)]
    ]);
}