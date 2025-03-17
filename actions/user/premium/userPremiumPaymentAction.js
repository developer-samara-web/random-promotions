// Импорты
import userPremiumPaymentMessage from "#messages/user/userPremiumPaymentMessage.js";
import userPremiumPaymentKeyboards from "#keyboards/user/userPremiumPaymentKeyboards.js";

// Логирование
import logger from "#utils/logs.js"

// Менб премиума
export default (telegram) => {
	try {
		telegram.action(/^user_premium_payment_(\d+)$/, async (ctx) => {
			return await ctx.editMessageText(await userPremiumPaymentMessage(ctx), {
				reply_markup: userPremiumPaymentKeyboards.reply_markup,
				parse_mode: "HTML",
			});
		});
	} catch (e) {
		logger.error('Ошибка (user_premium_payment)', e)
	}
};