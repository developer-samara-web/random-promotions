// Импорт
import formatDate from "#utils/formatDate.js";

// Сообщение "Профиль пользователя"
export async function profileMessage(user) {
    return (`👤 <b>Профиль пользователя:</b>\n\n🔹 <b>Имя:</b> ${user.first_name}\n🔹 <b>Username:</b> @${user.username || 'не указан'}\n🔹 <b>ID:</b> <code>${user.telegram_id}</code>\n\n🔔 <b>Подписка:</b>\n\n<b>${user.subscription?.is_active ? '🔹' : '🔹'} Статус:</b> ${user.subscription?.is_active ? 'Активна' : 'Не активна'}\n🔹 <b>Действует до:</b> ${user.subscription?.end_date ? `до ${formatDate(user.subscription.end_date)}` : '-'}`);
}

// Сообщение "Тех. Поддержка"
export async function supportUserMessage() {
    return (`🚨 <b>Контакты службы поддержки:</b>\n\n🔹 <b>Телефон:</b> +79657083147\n🔹 <b>Почта:</b> support@razdachkin.ru\n🔹 <b>Телеграмм:</b> @manager_razdachkin`);
}