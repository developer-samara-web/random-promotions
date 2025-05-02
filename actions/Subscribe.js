// Импорты
import { getUser } from "#controllers/User.js";
import { rulesMessage } from "#messages/Main.js";
import { getTariff, getTariffs } from "#controllers/Tariff.js";
import { subscribeMessage, subscribeShowMessage, subscribeShowRulesMessage, subscribeActiveSubscribeMessage } from "#messages/Subscribe.js";
import { subscribeKeyboard, subscribeShowKeyboard, subscribeShowRulesKeyboard } from "#keyboards/Subscribe.js";
import { MainMenuKeyboard, rulesKeyboard } from "#keyboards/Main.js";
import { setTransaction } from "#controllers/Transaction.js";

// Логирование
import logger from "#utils/logs.js";

// Экшен "Меню премиум подписки"
export async function subscribeAction(telegram) {
	telegram.action("user_premium", async (ctx) => {
		try {
			// Получаем пользователя
			const user = await getUser(ctx.from.id);
			// Если пользователь не зарегистрирован
			if (!user) {
				return await ctx.editMessageText(rulesMessage(), {
					reply_markup: rulesKeyboard().reply_markup,
					parse_mode: "HTML"
				});
			};
			// Проверяем подписку
			if (user.subscription.is_active) {
				return await ctx.editMessageText(subscribeActiveSubscribeMessage(), {
					reply_markup: MainMenuKeyboard().reply_markup,
					parse_mode: "HTML",
				});
			}
			// Получаем тарифы
			const tariffs = await getTariffs();
			// Отправляем сообщение
			return await ctx.editMessageText(subscribeMessage(ctx), {
				reply_markup: subscribeKeyboard(tariffs).reply_markup,
				parse_mode: "HTML",
				disable_web_page_preview: true,
			});
		} catch (e) {
			logger.error("Ошибка экшена [user_premium]:", e);
		}
	});
};

// Экшен "Оплата выбранной подписки"
export async function subscribeShowAction(telegram) {
	telegram.action(/^user_premium_[a-f\d]{24}$/i, async (ctx) => {
		try {
			// Получаем данные пользователя
			const user = await getUser(ctx.from.id);
			// Если пользователь не зарегистрирован
			if (!user) {
				return await ctx.editMessageText(rulesMessage(), {
					reply_markup: rulesKeyboard().reply_markup,
					parse_mode: "HTML"
				});
			};
			// Проверяем подписку
			if (user.subscription.is_active) {
				return await ctx.editMessageText(subscribeActiveSubscribeMessage(), {
					reply_markup: MainMenuKeyboard().reply_markup,
					parse_mode: "HTML",
				});
			}
			// Получаем данные тарифа
			const tariff = await getTariff(ctx.match[0].split("_")[2]);
			// Создаём транзакцию
			const transaction = await setTransaction({
				user_id: user._id,
				tariff_id: tariff._id,
				message_id: ctx.update.callback_query.message.message_id
			});
			// Создаём платёжную ссылку
			const invoice = await telegram.telegram.createInvoiceLink({
				title: tariff.name,
				description: "Оплата премиум подписки",
				currency: "XTR",
				prices: [{ label: tariff.name, amount: tariff.recurring_amount }],
				payload: JSON.stringify({
					userId: user._id,
					transactionId: transaction._id,
					tariffId: tariff._id
				})
			});
			// Отправляем сообщение
			return await ctx.editMessageText(subscribeShowMessage(), {
				reply_markup: subscribeShowKeyboard(tariff, user, invoice).reply_markup,
				parse_mode: "HTML",
				disable_web_page_preview: true,
			});
		} catch (e) {
			logger.error("Ошибка экшена [user_premium_show]:", e);
		}
	});
}

// Экшен "Согласие с правилами выбранной подписки подписки"
export async function subscribeShowRulesAction(telegram) {
	telegram.action(/^user_premium_rules_[a-f\d]{24}$/i, async (ctx) => {
		try {
			// Получаем данные о пользователе
			const user = await getUser(ctx.from.id);
			// Если пользователь не зарегистрирован
			if (!user) {
				return await ctx.editMessageText(rulesMessage(), {
					reply_markup: rulesKeyboard().reply_markup,
					parse_mode: "HTML"
				});
			};
			// Проверяем подписку
			if (user.subscription.is_active) {
				return await ctx.editMessageText(subscribeActiveSubscribeMessage(), {
					reply_markup: MainMenuKeyboard().reply_markup,
					parse_mode: "HTML",
				});
			}
			// Получаем данные о тарифе
			const tariff = await getTariff(ctx.match[0].split("_")[3]);
			// Отправляем сообщение
			return await ctx.editMessageText(subscribeShowRulesMessage(tariff), {
				reply_markup: subscribeShowRulesKeyboard(tariff, user).reply_markup,
				parse_mode: "HTML",
			});
		} catch (e) {
			logger.error("Ошибка экшена [user_premium_rules]:", e);
		}
	});
};
