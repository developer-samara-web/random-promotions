// Импорт
import { Markup } from "telegraf";

// Клавиатура "Главное меню"
export function startKeyboard(subscription, tariffs) {
    // Нормализуем
    const normalizedTariffs = Array.isArray(tariffs) ? tariffs : (tariffs ? [tariffs] : []);

    // Создаем кнопки тарифов
    const tariffButtons = normalizedTariffs.map(item => 
        [Markup.button.callback(item.name, `user_premium_rules_${item._id}`)]
    );

    // Формируем клавиатуру в зависимости от статуса подписки
    const premiumKeyboard = subscription?.is_active ? [
        [Markup.button.callback("👤 Мой Профиль", "user_profile")],
    ] : [
        [Markup.button.callback("👤 Мой Профиль", "user_profile")],
        ...tariffButtons,
        [Markup.button.callback("⭐️ Оформить подписку", "user_premium")]
    ];

    return Markup.inlineKeyboard(premiumKeyboard);
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
