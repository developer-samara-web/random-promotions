// Импорт
import { Markup } from "telegraf";

// Клавиатура "Главное меню"
export function startKeyboard(user) {
    return Markup.inlineKeyboard([
        [Markup.button.callback("👤 Мой Профиль", "user_profile")],
        ...(!user.subscription?.is_active ? [[Markup.button.callback("⭐️ Оформить подписку", "user_premium")]] : []),
        ...(user.role === 'admin' ? [[Markup.button.callback("🛠️ Панель администратора", "admin_menu")]] : []),
        [Markup.button.callback("🚨 Тех. Поддержка", "user_support")]
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
export function MainMenuKeyboard() {
    return Markup.inlineKeyboard([
        [Markup.button.callback("🚀 Главное меню", "start_menu")]
    ]);
}