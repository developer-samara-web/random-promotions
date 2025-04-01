// Импорт
import formatDate from '#utils/formatDate.js';

// Сообщение "Результаты акции"
export function resultMessage(promotion, winners) {
	return (`🎉 <b>ПОЗДРАВЛЯЕМ ПОБЕДИТЕЛЕЙ!</b> 🎉\n\n<b>Акция:</b> ${promotion.title}\n<b>Розыгрыш завершен:</b> ${formatDate(promotion.end_date)}\n\n🏆 <b>Список победителей:</b>\n${winners}\n💡 <b>Как получить приз:</b>\n1. Победитель должен написать в ЛС ${process.env.TELEGRAM_SUPPORT}\n2. Подтвердить контактные данные для отправки`);
};

// Сообщение "Оповещение о победе"
export function winnerMessage(promotion, post) {
	return (`🔥 <b>УРА! ВЫ ПОБЕДИЛИ!</b> 🔥\n\nДорогой друг, твоя удача сегодня на высоте!\nТы выиграл в нашей раздаче "<b>${promotion.title}</b>"!\n\n👉 Чтобы получить подарок напиши: ${process.env.TELEGRAM_SUPPORT}\n👉 Пост в канале: ${post}\n\nНевероятно рады за тебя! 🥳`);
};