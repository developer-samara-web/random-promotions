// Импорты
import { getUser, getUsers } from "#controllers/User.js";
import { getParticipants } from "#controllers/Participants.js";
import { adminMessage } from "#messages/Admin.js";
import { adminKeyboard } from "#keyboards/Admin.js";
import { errorMessage } from "#messages/Main.js";
import { MainMenuKeyboard } from "#keyboards/Main.js";
import { getPromotions } from "#controllers/Promotion.js";

// Логирование
import logger from "#utils/logs.js";

// Экшен "Панель админисратора"
export async function adminAction(telegram) {
	telegram.action("admin_menu", async (ctx) => {
		try {
			// Получаем пользователя
			const user = await getUser(ctx.from.id);
			// Если пользователь не зарегистрирован
			if (!user.is_admin) {
				return await ctx.editMessageText(errorMessage(), {
					reply_markup: MainMenuKeyboard().reply_markup,
					parse_mode: "HTML",
					disable_web_page_preview: true,
				});
			};
			// Получаем всех пользователей
			const users = await getUsers({});
			// Получаем все участия
			const participants = await getParticipants();
			// Получаем все раздачи
			const promotions = await getPromotions();
			// Отправляем в главное меню
			return await ctx.editMessageText(adminMessage(users.length, participants, promotions.length), {
				reply_markup: adminKeyboard(user).reply_markup,
				parse_mode: "HTML",
				disable_web_page_preview: true,
			});
		} catch (e) {
			logger.error("Ошибка экшена [admin_menu]:", e);
		}
	});
};