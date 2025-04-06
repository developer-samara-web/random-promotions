// Импорт
import { Markup } from "telegraf";

// Логирование
import logger from "#utils/logs.js";

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
export function subscribeShowKeyboard(tariff) {
    try {
        return Markup.inlineKeyboard([
            [Markup.button.webApp(`💳 Клауд Пайментс | ${tariff.amount} руб`, `${process.env.TELEGRAM_WEBAPP}/payment/${tariff._id}`)],
            [Markup.button.callback("⬅️ Главное меню", "start_menu")],
        ]);
    } catch (e) {
        logger.error("Ошибка в userPremiumShowKeyboards:", e);
    }
}

// Клавиатура "Успешная оплата подписки"
export function subscribePaymentKeyboard() {
    return Markup.inlineKeyboard([
        [Markup.button.callback("👤 Профиль", "user_profile")],
        [Markup.button.callback("⬅️ Главное меню", "start_menu")],
    ]);
}