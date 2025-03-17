// Импорты
import userPremiumMessage from "#messages/user/userPremiumMessage.js";
import userPremiumKeyboards from "#keyboards/user/userPremiumKeyboards.js";

// Логирование
import logger from "#utils/logs.js"

// Меню премиума
export default (telegram) => {
	try {
		telegram.action("user_premium", async (ctx) => {
			return await ctx.editMessageText(await userPremiumMessage(ctx), {
				reply_markup: userPremiumKeyboards.reply_markup,
				parse_mode: "HTML",
			});
		});
	} catch (e) {
		logger.error('Ошибка (user_premium)', e)
	}
};