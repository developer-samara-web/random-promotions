// Импорты
import { setUser, getUser, checkUser, updateUser } from "#controllers/userController.js";
import { startMessage, rulesAcceptMessage, errorMessage } from "#messages/mainMessages.js";
import { startKeyboard, rulesAcceptKeyboard, MainMenuKeyboard } from "#keyboards/mainKeyboards.js";
import { getTariffs } from "#controllers/tariffController.js";

// Логирование
import logger from "#utils/logs.js";

// Экшен "Главное меню"
export async function startAction(telegram) {
	try {
		telegram.action("start_menu", async (ctx) => {
			const user = await getUser(ctx.from.id);
			if(!user) throw new Error('Пользователь не найден');
			const tariffs = await getTariffs();
			const promoTarifs = tariffs.find((tariff) => tariff.main_menu)
			return await ctx.editMessageText(startMessage(ctx), {
				reply_markup: startKeyboard(user.subscription, promoTarifs).reply_markup,
				parse_mode: "HTML",
				disable_web_page_preview: true,
			});
		});
	} catch (e) {
		logger.error('Ошибка экшена (start_menu):', e);
	}
};

// Экшен "Правила"
export async function rulesAction(telegram) {
	try {
		telegram.action("rules_accept", async (ctx) => {
			// Получаем данные пользователя
			const { id, username = null, first_name = null } = ctx.from;
			// Проверка подписки на канал
			const channel_subscription = await checkUser(ctx);
			// Создаём нового юзера
			const user = await setUser({ telegram_id: id, username, first_name, channel_subscription });
			// Если пользователь не создался
			if (!user) {
				await ctx.editMessageText(errorMessage(), {
					reply_markup: MainMenuKeyboard().reply_markup,
					parse_mode: "HTML"
				});

				await updateUser()
			}
			// Если пользователь создался
			await ctx.editMessageText(rulesAcceptMessage(), {
				reply_markup: rulesAcceptKeyboard().reply_markup,
				parse_mode: "HTML"
			});
		});
	} catch (e) {
		logger.error('Ошибка экшена (rules_accept):', e);
	}
}