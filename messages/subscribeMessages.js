// Импорт
import formatDate from "#utils/formatDate.js";

// Сообщение "Меню премиум подписки"
export function subscribeMessage() {
	return (`🌟 <b>Почему вам нужна премиум подписка на наш канал?</b>\n\n✨ <b>Без премиум подписки:</b>\n\nВы можете участвовать только в 2 раздачах без пометки ⭐️.\nВы не можете участвовать в Раздача для Премиум-пользователей!\n\n✨ <b>С премиум подпиской:</b>\n\nУберите все ограничения! Вы можете участвовать в бесконечном количестве раздач.\nПолучите доступ к эксклюзивным премиум раздачам! 🎁`);
}

// Сообщение "Меню оплаты выбранной подписки"
export function subscribeShowMessage(tariff) {
	return (`Пожалуйста, выберите удобный метод оплаты:\n\n⚠️ Пробная подписка после истечения срока действия включает в себя автопродление на месяц: ${tariff.recurring_amount}р \n\nПереходя на окно оплаты вы подтверждаете ознакомление и согласие с регламентом действия рекуррентных платежей.`);
}

// Сообщение "Меню условий оплаты подписки"
export function subscribeShowRulesMessage(tariff) {
	return (`<b>🔹 Условия оказания услуг</b>\n\n<blockquote expandable>Осуществляя оплату, <b>Вы подтверждаете ознакомление со всеми текущими тарифами сервиса</b>, а также даете согласие на дальнейшую пролонгацию платежей.\n\n${tariff.rules}</blockquote>`);
}

// Сообщение "Успешная оплата подписки"
export function subscribePaymentMessage(user) {
	return (`🎉 <b>Транзакция прошла успешно!</b>\n\nТеперь вам доступны все функции нашего бота, ваша премиум-подписка активирована до: ${formatDate(user.subscription.end_date)}`);
}