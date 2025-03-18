// Импорты
import { setUser } from "#controllers/userController.js";
import { startMessage, rulesAcceptMessage, errorMessage } from "#messages/mainMessages.js";
import { startKeyboard, rulesAcceptKeyboard, errorKeyboard } from "#keyboards/mainKeyboards.js";


// Логирование
import logger from "#utils/logs.js";

// Экшен "Главное меню"
export async function startAction(telegram) {
	try {
		telegram.action("start_menu", async (ctx) => {
			return await ctx.editMessageText(startMessage(ctx), {
				reply_markup: startKeyboard().reply_markup,
				parse_mode: "HTML",
			});
		});
	} catch (e) {
		logger.error('Ошибка экшена (start_menu):', e);
	}
};

// Экшен "Правила"
export async function rulesAction(telegram) {
	try{
		telegram.action("rules_accept", async (ctx) => {
			// Получаем данные пользователя
			const { id, username = null, first_name = null } = ctx.from;
			// Создаём нового юзера
			const user = await setUser({ telegram_id: id, username, first_name });
			// Если пользователь не создался
			if (!user) {
				await ctx.editMessageText(errorMessage(), {
					reply_markup: errorKeyboard().reply_markup,
					parse_mode: "HTML"
				});
			}
			// Если пользователь создался
			await ctx.editMessageText(rulesAcceptMessage(), {
				reply_markup: rulesAcceptKeyboard().reply_markup,
				parse_mode: "HTML"
			});
		});
	} catch (e){
		logger.error('Ошибка экшена (rules_accept):', e);
	}
}