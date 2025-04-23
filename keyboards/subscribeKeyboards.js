// Импорт
import { Markup } from "telegraf";

// Логирование
import logger from "#utils/logs.js";

// Клавиатура "Меню премиум подписки"
export function subscribeKeyboard(tariffs) {
    const buttons = tariffs.map(tariff => {
        let buttonText;
        // Форматируем текст кнопки в зависимости от типа тарифа
        buttonText = `${tariff.name}`;
        // Создаем callback данные в формате "user_premium_<цена>"
        const callbackData = `user_premium_rules_${tariff._id}`;
        return [Markup.button.callback(buttonText, callbackData)];
    });
    // Добавляем кнопку "Назад" в конец клавиатуры
    buttons.push([Markup.button.callback("⬅️ Назад", "start_menu")]);
    return Markup.inlineKeyboard(buttons);
}

// Клавиатура "Меню оплаты выбранной подписки"
export function subscribeShowKeyboard(tariff, user) {
    try {
        return Markup.inlineKeyboard([
            [Markup.button.url(`💳 Оплатить | ${tariff.recurring_amount} руб`, `${process.env.TELEGRAM_WEBAPP}/payment/${tariff._id}/${user.telegram_id}`)],
            [Markup.button.callback("⬅️ Главное меню", "start_menu")],
        ]);
    } catch (e) {
        logger.error("Ошибка в userPremiumShowKeyboards:", e);
    }
}

// Клавиатура "Меню правил оплаты выбранной подписки"
export function subscribeShowRulesKeyboard(tariff) {
    try {
        return Markup.inlineKeyboard([
            [
                Markup.button.callback("⬅️ Назад", `user_premium`),
                Markup.button.callback("✅ Я согласен(-а)", `user_premium_${tariff._id}`)
            ],
        ]);
    } catch (e) {
        logger.error("Ошибка в userPremiumShowRulesKeyboards:", e);
    }
}

// Клавиатура "Успешная оплата подписки"
export function subscribePaymentKeyboard() {
    return Markup.inlineKeyboard([
        [Markup.button.callback("👤 Профиль", "user_profile")],
        [Markup.button.callback("⬅️ Главное меню", "start_menu")],
    ]);
}

// Клавиатура "Ошибка подписки"
export function subscribeActiveSubscribeKeyboard() {
    return Markup.inlineKeyboard([
        [Markup.button.callback("⬅️ Главное меню", "start_menu")],
    ]);
}