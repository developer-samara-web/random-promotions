// Импорт
import { Markup } from "telegraf";

// Клавиатура "Профиль пользователя"
export function profileKeyboard() {
    return Markup.inlineKeyboard([
        [Markup.button.callback("⬅️ Назад", "start_menu")],
    ]);
}