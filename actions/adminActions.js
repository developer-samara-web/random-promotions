// Импорты
import { adminMessage } from "#messages/adminMessages.js";
import { adminKeyboard } from "#keyboards/adminKeyboards.js";

// Логирование
import logger from "#utils/logs.js";

// Экшен "Панель администратора"
export async function adminAction(telegram) {
	try {
		telegram.action("admin_menu", async (ctx) => {
			return await ctx.editMessageText(adminMessage(ctx), {
				reply_markup: adminKeyboard().reply_markup,
				parse_mode: "HTML",
			});
		});
	} catch (e) {
		logger.error('Ошибка экшена (admin_menu):', e);
	}
};