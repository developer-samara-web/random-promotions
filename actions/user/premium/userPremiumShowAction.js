// Импорты
import userPremiumShowMessage from "#messages/user/userPremiumShowMessage.js";
import userPremiumShowKeyboards from "#keyboards/user/userPremiumShowKeyboards.js";

// Логирование
import logger from "#utils/logs.js"

// Меню скидки на премиум
export default (telegram) => {
	try {
		telegram.action(/^user_premium_(\d+)$/, async (ctx) => {
			// Извлекаем цену из callback_data
			const price = ctx.match[0].split("_")[2];

			return await ctx.editMessageText(await userPremiumShowMessage(ctx, price), {
				reply_markup: userPremiumShowKeyboards(price).reply_markup,
				parse_mode: "HTML",
			});
		});
	} catch (error) {
		logger.error("Ошибка при регистрации обработчика (user_premium):", error);
	}
};