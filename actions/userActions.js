// Импорты
import { getUser} from "#controllers/userController.js";
import { profileMessage } from "#messages/userMessages.js";
import { profileKeyboard } from "#keyboards/userKeyboards.js";

// Логирование
import logger from "#utils/logs.js";

// Экшен "Профиль пользователя"
export async function profileAction(telegram) {
	try {
		telegram.action("user_profile", async (ctx) => {
			// Получаем данные пользователя
			const user = await getUser(ctx.from.id)
			return await ctx.editMessageText(await profileMessage(user), {
				reply_markup: profileKeyboard().reply_markup,
				parse_mode: "HTML",
			});
		});
	} catch (e) {
		logger.error('Ошибка экшена (user_profile):', e);
	}
};