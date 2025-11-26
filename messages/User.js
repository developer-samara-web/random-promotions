// Импорт
import formatDate from "#utils/formatDate.js";

// Сообщение "Профиль пользователя"
export async function profileMessage(user) {
    return (`👤 <b>Профиль пользователя:</b>\n\n🔹 <b>Имя:</b> ${user.first_name}\n🔹 <b>Username:</b> @${user.username || 'не указан'}\n🔹 <b>ID:</b> <code>${user.telegram_id}</code>\n\n🔔 <b>Подписка на Приватный канал</b>\n\n<b>${user.subscription?.is_active ? '🔹' : '🔹'} Статус:</b> ${user.subscriptions?.private?.is_subscribe ? 'Активна' : 'Не активна'}\n🔹 <b>Действует до:</b> ${user.subscriptions?.private?.is_subscribe ? `${formatDate(user.subscriptions?.private?.expires_at)}` : '-'}`);
}