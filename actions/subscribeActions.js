// Импорты
import { getUser } from "#controllers/userController.js";
import { getTariff, getTariffs } from "#controllers/tariffController.js";
import { subscribeMessage, subscribeShowMessage, subscribeShowRulesMessage, subscribeActiveSubscribeMessage } from "#messages/subscribeMessages.js";
import { subscribeKeyboard, subscribeShowKeyboard, subscribeShowRulesKeyboard, subscribeActiveSubscribeKeyboard } from "#keyboards/subscribeKeyboards.js";

// Логирование
import logger from "#utils/logs.js";

// Экшен "Премиум подписка"
export async function subscribeAction(telegram) {
	try {
		telegram.action("user_premium", async (ctx) => {
			const user = await getUser(ctx.from.id);
			const tariffs = await getTariffs();
			// Проверяем подписку
			if (user.subscription.is_active) {
				return await ctx.editMessageText(subscribeActiveSubscribeMessage(), {
					reply_markup: subscribeActiveSubscribeKeyboard().reply_markup,
					parse_mode: "HTML",
				});
			} else {
				return await ctx.editMessageText(subscribeMessage(ctx), {
					reply_markup: subscribeKeyboard(tariffs).reply_markup,
					parse_mode: "HTML",
					disable_web_page_preview: true,
				});
			}
		});
	} catch (e) {
		logger.error('Ошибка экшена (user_premium)', e);
	}
};

// Экшен "Оплата выбранной подписки"
export async function subscribeShowAction(telegram) {
	try {
		telegram.action(/^user_premium_[a-f\d]{24}$/i, async (ctx) => {
			// Получаем данные о пользователе
			const user = await getUser(ctx.from.id);
			const tariff = await getTariff(ctx.match[0].split("_")[2]);
			// Проверяем подписку
			if (user.subscription.is_active) {
				return await ctx.editMessageText(subscribeActiveSubscribeMessage(tariff), {
					reply_markup: subscribeActiveSubscribeKeyboard().reply_markup,
					parse_mode: "HTML",
					disable_web_page_preview: true,
				});
			} else {
				return await ctx.editMessageText(subscribeShowMessage(), {
					reply_markup: subscribeShowKeyboard(tariff, user).reply_markup,
					parse_mode: "HTML",
					disable_web_page_preview: true,
				});
			}
		});
	} catch (e) {
		logger.error("Ошибка экшена (user_premium_number):", e);
	}
};

// Экшен "Согласие с правилами выбранной подписки подписки"
export async function subscribeShowRulesAction(telegram) {
	try {
		telegram.action(/^user_premium_rules_[a-f\d]{24}$/i, async (ctx) => {
			// Получаем данные о пользователе
			const user = await getUser(ctx.from.id);
			// Получаем данные о тарифе
			const tariff = await getTariff(ctx.match[0].split("_")[3]);
			// Проверяем подписку
			if (user.subscription.is_active) {
				return await ctx.editMessageText(subscribeActiveSubscribeMessage(tariff), {
					reply_markup: subscribeActiveSubscribeKeyboard().reply_markup,
					parse_mode: "HTML",
				});
			} else {
				return await ctx.editMessageText(subscribeShowRulesMessage(tariff), {
					reply_markup: subscribeShowRulesKeyboard(tariff, user).reply_markup,
					parse_mode: "HTML",
				});
			}
		});
	} catch (e) {
		logger.error("Ошибка экшена (user_premium_number):", e);
	}
};
