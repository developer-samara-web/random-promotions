// Импорты
import { getUser, updateUser } from "#controllers/userController.js";
import { profileMessage, subscribeUserMessage } from "#messages/userMessages.js";
import { profileKeyboard, subscribeUserKeyboard } from "#keyboards/userKeyboards.js";
import { updatePayment } from "#controllers/paymentsController.js";

// Логирование
import logger from "#utils/logs.js";

// Экшен "Профиль пользователя"
export async function profileAction(telegram) {
	try {
		telegram.action("user_profile", async (ctx) => {
			// Получаем данные пользователя
			const user = await getUser(ctx.from.id)
			return await ctx.editMessageText(await profileMessage(user), {
				reply_markup: profileKeyboard().reply_markup,
				parse_mode: "HTML",
			});
		});
	} catch (e) {
		logger.error('Ошибка экшена (user_profile):', e);
	}
};

// Экшен "Настройка подписки пользователя"
export async function subscribeUserAction(telegram) {
	try {
		telegram.action("user_subscribe", async (ctx) => {
			// Получаем данные пользователя
			const user = await getUser(ctx.from.id)
			return await ctx.editMessageText(await subscribeUserMessage(user), {
				reply_markup: subscribeUserKeyboard(user.subscription.is_auto_renewal, user.subscription.is_active).reply_markup,
				parse_mode: "HTML",
			});
		});
	} catch (e) {
		logger.error('Ошибка экшена (user_subscribe):', e);
	}
};

// Экшен "Активация / Деактивация автопродление подписки"
export async function subscribeToggleAction(telegram) {
	try {
		telegram.action("user_subscribe_toggle", async (ctx) => {
			// Получаем данные пользователя
			const user = await getUser(ctx.from.id)
			// Обновляем данные пользователя
			const update = await updateUser(ctx.from.id, {
				'subscription.is_auto_renewal': !user.subscription.is_auto_renewal,
			})

			await updatePayment(user.subscription.id, {
				MaxPeriods: !user.subscription.is_auto_renewal ? 100 : 1
			})

			logger.info(`Пользователь ${update.subscription.is_auto_renewal ? "включил" : "отключил"} автоподписку: ID:${update._id}`);
			return await ctx.editMessageText(await subscribeUserMessage(update), {
				reply_markup: subscribeUserKeyboard(update.subscription.is_auto_renewal, update.subscription.is_active).reply_markup,
				parse_mode: "HTML",
			});
		});
	} catch (e) {
		logger.error('Ошибка экшена (user_subscribe):', e);
	}
};

// Экшен "У вас нет активных подписок"
export async function subscribeEmptyAction(telegram) {
	try {
		telegram.action("empty_action", async (ctx) => {
			ctx.answerCbQuery();
		});
	} catch (e) {
		logger.error('Ошибка экшена (user_subscribe):', e);
	}
};