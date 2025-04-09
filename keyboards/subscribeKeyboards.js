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
        const callbackData = `user_premium_${tariff._id}`;
        return [Markup.button.callback(buttonText, callbackData)];
    });
    // Добавляем кнопку "Назад" в конец клавиатуры
    buttons.push([Markup.button.callback("⬅️ Назад", "start_menu")]);
    return Markup.inlineKeyboard(buttons);
}

// Клавиатура "Меню оплаты выбранной подписки"
export function subscribeShowKeyboard(tariff) {
    try {
        return Markup.inlineKeyboard([
            [Markup.button.webApp(`💳 Клауд Пайментс | ${tariff.initial_amount || tariff.recurring_amount} руб`, `${process.env.TELEGRAM_WEBAPP}/payment/${tariff._id}`)],
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