// Импорт
import { Markup } from "telegraf";

// Клавиатура "Профиль пользователя"
export function profileKeyboard() {
    return Markup.inlineKeyboard([
        [Markup.button.callback("⚙️ Управление подпиской", "user_subscribe")],
        [Markup.button.callback("⬅️ Назад", "start_menu")],
    ]);
}

// Клавиатура "Настройка подписки пользователя"
export function subscribeUserKeyboard(toggle) {
    return Markup.inlineKeyboard([
        [Markup.button.callback(toggle ? "❌ Отменить автопродление" : "❇️ Активировать автопродление", "user_subscribe_toggle")],
        [Markup.button.callback("⬅️ Назад", "user_profile")],
    ]);
}