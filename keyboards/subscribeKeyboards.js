// Импорт
import { Markup } from "telegraf";

// Клавиатура "Меню премиум подписки"
export function subscribeKeyboard() {
    return Markup.inlineKeyboard([
        [Markup.button.callback("🔥 2 дня за 1 рубль 🔥", "user_premium_1")],
        [Markup.button.callback("❤️‍🔥 Недельная | 150 рублей", "user_premium_150")],
        [Markup.button.callback("❤️‍🔥 Месячная | 500 рублей", "user_premium_500")],
        [Markup.button.callback("⬅️ Назад", "start_menu")],
    ]);
}

// Клавиатура "Меню оплаты выбранной подписки"
export function subscribeShowKeyboard(price) {
    try {
        return Markup.inlineKeyboard([
            [Markup.button.callback(`💳 Клауд Пайментс | ${price} руб`, `user_premium_payment_${price}`)],
            [Markup.button.callback("⬅️ Назад", "user_premium")],
        ]);
    } catch (error) {
        logger.error("Ошибка в userPremiumShowKeyboards:", error);
    }
}

// Клавиатура "Успешная оплата подписки"
export function subscribePaymentKeyboard() {
    return Markup.inlineKeyboard([
        [Markup.button.callback("👤 Профиль", "user_profile")],
        [Markup.button.callback("⬅️ Главное меню", "start_menu")],
    ]);
}