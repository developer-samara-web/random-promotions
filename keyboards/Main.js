// Импорт
import { Markup } from "telegraf";

// Клавиатура "Главное меню"
export function startKeyboard(user) {
    return Markup.inlineKeyboard([
        [Markup.button.callback("👤 Мой Профиль", "user_profile")],
        ...(!user.subscription?.is_active ? [[Markup.button.url("⭐️ Оформить подписку", "https://t.me/tribute/app?startapp=sGch")]] : []),
        ...(user.is_admin ? [[Markup.button.callback("🛠️ Панель администратора", "admin_menu")]] : []),
        [Markup.button.url("🚨 Тех. Поддержка", "https://t.me/gar_sem")]
    ]);
}

// Клавиатура "Правила"
export function rulesKeyboard() {
    return Markup.inlineKeyboard([
        [Markup.button.callback("✅ Принять", `rules_accept`)]
    ]);
}

// Клавиатура "Подтверждении правил"
export function rulesAcceptKeyboard() {
    return Markup.inlineKeyboard([
        [Markup.button.callback("🚀 Начать", "start_menu")]
    ]);
}

// Клавиатура "Главное меню"
export function DeleteKeyboard() {
    return Markup.inlineKeyboard([
        [Markup.button.callback("✅ Закрыть", "delete_menu")]
    ]);
}

// Клавиатура "Главное меню"
export function MainMenuKeyboard() {
    return Markup.inlineKeyboard([
        [Markup.button.callback("🚀 Главное меню", "start_menu")]
    ]);
}