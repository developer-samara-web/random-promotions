// Импорты
import { getUser } from "#controllers/User.js";
import { rulesMessage } from "#messages/Main.js";
import { rulesKeyboard } from "#keyboards/Main.js";
import { profileMessage } from "#messages/User.js";
import { profileKeyboard } from "#keyboards/User.js";

// Логирование
import logger from "#utils/logs.js";

// Экшен "Профиль пользователя"
export async function profileAction(telegram) {
	telegram.action("user_profile", async (ctx) => {
		try {
			// Получаем данные пользователя
			const user = await getUser(ctx.from.id)
			// Если пользователь не зарегистрирован
			if (!user) {
				return await ctx.editMessageText(rulesMessage(), {
					reply_markup: rulesKeyboard().reply_markup,
					parse_mode: "HTML"
				});
			};
			// Отправляем сообщение
			return await ctx.editMessageText(await profileMessage(user), {
				reply_markup: profileKeyboard(user).reply_markup,
				parse_mode: "HTML",
			});
		} catch (e) {
			logger.error("Ошибка экшена [user_profile]:", e);
		}
	});
};