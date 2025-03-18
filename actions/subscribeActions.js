// Импорты
import { subscribeMessage, subscribeShowMessage, subscribePaymentMessage } from "#messages/subscribeMessages.js";
import { subscribeKeyboard, subscribeShowKeyboard, subscribePaymentKeyboard } from "#keyboards/subscribeKeyboards.js";

// Логирование
import logger from "#utils/logs.js";

// Экшен "Премиум подписка"
export async function subscribeAction (telegram) {
	try {
		telegram.action("user_premium", async (ctx) => {
			return await ctx.editMessageText(subscribeMessage(ctx), {
				reply_markup: subscribeKeyboard().reply_markup,
				parse_mode: "HTML",
			});
		});
	} catch (e) {
		logger.error('Ошибка экшена (user_premium)', e);
	}
};

// Экшен "Оплата выбранной подписки"
export async function subscribeShowAction(telegram) {
	try {
		telegram.action(/^user_premium_(\d+)$/, async (ctx) => {
			// Извлекаем цену из callback_data
			const price = ctx.match[0].split("_")[2];
			return await ctx.editMessageText(subscribeShowMessage(ctx, price), {
				reply_markup: subscribeShowKeyboard(price).reply_markup,
				parse_mode: "HTML",
			});
		});
	} catch (e) {
		logger.error("Ошибка экшена (user_premium_number):", e);
	}
};

// Экшен "Успешная оплата подписки"
export async function subscribePaymentAction(telegram) {
	try {
		telegram.action(/^user_premium_payment_(\d+)$/, async (ctx) => {
			return await ctx.editMessageText(subscribePaymentMessage(ctx), {
				reply_markup: subscribePaymentKeyboard().reply_markup,
				parse_mode: "HTML",
			});
		});
	} catch (e) {
		logger.error('Ошибка (user_premium_payment)', e);
	}
};