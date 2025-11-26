// Импорты
import { getUser } from "#controllers/User.js";
import { startMessage, rulesMessage, premiumMessage } from "#messages/Main.js";
import { startKeyboard, rulesKeyboard, premiumKeyboard } from "#keyboards/Main.js";

// Логирование
import logger from "#utils/logs.js";

// Контроллер "Авторизация / Регистрация"
export default async (ctx) => {
	// Проверка входных данных
	if (ctx.chat.type !== 'private') return;

	try {
		// Получаем данные о пользователе
		const { id } = ctx.from;
		// Проверяем пользователя
		const user = await getUser(id);
		// Проверяем сушествование пользователя
		if (!user) {
			// Отправляем первое сообщение с правилами
			await ctx.replyWithHTML(rulesMessage(), { disable_web_page_preview: true, ...rulesKeyboard() });
		} else {
			if (ctx.message.text.includes('premium')) {
				return await ctx.replyWithHTML(premiumMessage(), { disable_web_page_preview: true, ...premiumKeyboard() });
			}
			// Если пользователь
			return await ctx.replyWithHTML(startMessage(ctx), { disable_web_page_preview: true, ...startKeyboard(user) });
		}
	} catch (e) {
		logger.error('Ошибка регистрации пользователя:', e);
	}
};