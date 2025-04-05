// Импорты
import { getUser } from "#controllers/userController.js";
import { getTariffByAmount } from "#controllers/tariffController.js";
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
			// Получаем данные о пользователе
			const user = await getUser(ctx.from.id);
			// Получаем данные о тарифе
			const tariff = await getTariffByAmount(ctx.match[0].split("_")[2]);
			return await ctx.editMessageText(subscribeShowMessage(ctx, tariff.amount), {
				reply_markup: subscribeShowKeyboard(tariff, user).reply_markup,
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
			const user = await getUser(ctx.from.id)
			// TODO Функция проведения оплаты подписки
			return await ctx.editMessageText(subscribePaymentMessage(user), {
				reply_markup: subscribePaymentKeyboard().reply_markup,
				parse_mode: "HTML",
			});
		});
	} catch (e) {
		logger.error('Ошибка (user_premium_payment)', e);
	}
};