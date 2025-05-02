// Импорты
import { setUser, getUser, checkUser } from "#controllers/User.js";
import { startMessage, rulesAcceptMessage, rulesMessage, errorMessage } from "#messages/Main.js";
import { startKeyboard, rulesAcceptKeyboard, rulesKeyboard } from "#keyboards/Main.js";

// Логирование
import logger from "#utils/logs.js";

// Экшен "Главное меню"
export async function startAction(telegram) {
	telegram.action("start_menu", async (ctx) => {
		try {
			// Получаем пользователя
			const user = await getUser(ctx.from.id);
			// Если пользователь не зарегистрирован
			if (!user) {
				return await ctx.editMessageText(rulesMessage(), {
					reply_markup: rulesKeyboard().reply_markup,
					parse_mode: "HTML"
				});
			};
			// Отправляем в главное меню
			return await ctx.editMessageText(startMessage(ctx), {
				reply_markup: startKeyboard(user).reply_markup,
				parse_mode: "HTML",
				disable_web_page_preview: true,
			});
		} catch (e) {
			logger.error("Ошибка экшена [start_menu]:", e);
		}
	});
};

// Экшен "Правила"
export async function rulesAction(telegram) {
	telegram.action("rules_accept", async (ctx) => {
		try {
			// Получаем данные пользователя
			const { id, username = null, first_name = null } = ctx.from;
			// Проверка подписки на канал
			const channel_subscription = await checkUser(ctx);
			// Создаём нового юзера
			const user = await setUser({
				telegram_id: id,
				username, first_name,
				channel_subscription
			});
			// Если пользователь не создался
			if (!user) {
				return await ctx.editMessageText(rulesMessage(), {
					parse_mode: "HTML"
				});
			};
			// Если пользователь создался
			await ctx.editMessageText(rulesAcceptMessage(), {
				reply_markup: rulesAcceptKeyboard().reply_markup,
				parse_mode: "HTML"
			});
		} catch (e) {
			logger.error("Ошибка экшена [rules_accept]:", e);
		}
	});
}