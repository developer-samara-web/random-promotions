// Импорт
import formatDate from "#utils/formatDate.js";

// Сообщение "Профиль пользователя"
export async function profileMessage(user) {
    return (`👤 <b>Профиль пользователя:</b>\n\n📌 <b>Имя:</b> ${user.first_name}\n📧 <b>Username:</b> @${user.username || 'не указан'}\n🆔 <b>ID:</b> <code>${user.telegram_id}</code>\n\n🔔 <b>Premium подписка:</b> ${user.subscription?.is_active ? '✅ Активна' : 'Не активна'}\n📅 <b>Срок действия:</b> ${user.subscription?.end_date ? `до ${formatDate(user.subscription.end_date)}` : 'Не активна'}`);
}

// Сообщение "Настройка подписки пользователя"
export async function subscribeUserMessage(user) {
    return (`🔔 <b>Управление подпиской:</b>\n\n🔔 <b>Ваша подписка:</b> ${user.subscription?.is_active ? '✅ Активна' : 'Не активна'}\n🔄 <b>Автопродление:</b> ${user.subscription?.is_auto_renewal ? '✅ Активно' : 'Не активно'}\n\n<b>Вы можете:</b>\n- Отключить автопродление\n- Вернуться в главное меню\n\n<b>Используйте кнопки ниже, чтобы управлять подпиской.</b>`);
}

// Сообщение "Тех. Поддержка"
export async function supportUserMessage() {
    return (`🔔 <b>Контактная информация службы поддержки клиентов:</b>\n\nТелефон: +79657083147\nПочта: support@razdachkin.ru\nТелеграмм: @manager_razdachkin`);
}