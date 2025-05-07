// Импорт
import formatDate from "#utils/formatDate.js";

function parseMicrosoftJsonDate(dateStr) {
    const timestamp = parseInt(dateStr.match(/\d+/)[0]);
    return new Date(timestamp);
}

// Сообщение "Удачная оплата"
export function PaymentSuccessMessage(date) {
    return (`<b>🎉  Успешная оплата PREMIUM</b>\n\nМы получили подтверждение оплаты. Теперь вам доступны все функции нашего бота, ваша премиум-подписка активирована <b>до: ${parseMicrosoftJsonDate(date).toLocaleString()}</b>.`);
}

// Сообщение "Неудачная оплата"
export function PaymentErrorMessage() {
    return (`<b>⚠️  К сожалению, оплата PREMIUM не удалась</b>\n\nМы обнаружили проблему при обработке платежа. Пожалуйста, проверьте:\n\n- Вашу банковскую карту на наличие ошибок.\n- Достаточность средств на счете.\n- Подключен ли ваш интернет.\n\nЕсли проблема сохраняется, свяжитесь с нашей службой поддержки ${process.env.TELEGRAM_SUPPORT}.`);
}