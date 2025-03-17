// Импорты
import startMessage from "#messages/startMessage.js";
import startKeyboards from "#keyboards/startKeyboards.js";

// Логирование
import logger from "#utils/logs.js"

// Стартовое меню
export default (telegram) => {
	try {
		telegram.action("start_menu", async (ctx) => {
			return await ctx.editMessageText(await startMessage(ctx), {
				reply_markup: startKeyboards.reply_markup,
				parse_mode: "HTML",
			});
		});
	} catch (e) {
		logger.error('Ошибка (start_menu)', e)
	}
};