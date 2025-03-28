// Импорт
import formatDate from '#utils/formatDate.js';

// Сообщение "Результаты акции"
export function resultMessage(promotion) {
	return (`🎉 <b>ПОЗДРАВЛЯЕМ ПОБЕДИТЕЛЕЙ!</b> 🎉\n\n<b>Акция:</b> ${promotion.title}\n<b>Розыгрыш завершен:</b> ${formatDate(promotion.end_date)}\n\n🏆 <b>Список победителей:</b>\n{ИМЕНА ПОБЕДИТЕЛЕЙ}\n\n💡 <b>Как получить приз:</b>\n1. Победитель должен написать в ЛС ${process.env.TELEGRAM_SUPPORT}\n2. Подтвердить контактные данные для отправки`);
};