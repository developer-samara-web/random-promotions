// Импорты
import { getUser } from "#controllers/User.js";
import { rulesMessage } from "#messages/Main.js";
import { supportUserMessage } from "#messages/User.js";
import { MainMenuKeyboard, rulesKeyboard } from "#keyboards/Main.js";

// Экшен "Тех. Поддержка"
export async function supportAction(telegram) {
	telegram.action("user_support", async (ctx) => {
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
			return await ctx.editMessageText(await supportUserMessage(), {
				reply_markup: MainMenuKeyboard().reply_markup,
				parse_mode: "HTML",
			});
		} catch (e) {
			logger.error("Ошибка экшена [user_profile]:", e);
		}
	});
};