// Сообщение "Результаты акции"
export function resultMessage(promotion, winners) {
	return (`<b>✨ Итоги <a href="${process.env.TELEGRAM_CHANEL_URL}/${promotion.message_id}">#Раздаче${promotion.title_id}</a></b>\n\nДорогие друзья! Мы рады подвести итоги нашей очередной Раздачи и поздравить победителей! 🏆\n\n🥳 Поздравляем наших победителей:\n\n<blockquote>${winners.join('\n')}</blockquote>\n\n💬 Чтобы получить свой приз, пишите нам в Телеграм ${process.env.TELEGRAM_SUPPORT} ! Мы будем ждать ваших сообщений! 🚀`);
};

// Сообщение "Оповещение о победе"
export function winnerMessage(promotion, post) {
	return (`🔥 <b>УРА! ВЫ ПОБЕДИЛИ!</b> 🔥\n\nДорогой друг, твоя удача сегодня на высоте!\nТы выиграл в нашей раздаче <a href="${process.env.TELEGRAM_CHANEL_URL}/${promotion.message_id}">#Раздаче${promotion.title_id}</a>!\n\n👉 Чтобы получить подарок напиши: ${process.env.TELEGRAM_SUPPORT}\n👉 Пост в канале: ${post}\n\nНевероятно рады за тебя! 🥳`);
};