// Импорты
import { ResultMessage, WinnerMessage } from "#messages/Promotion.js";
import { PaymentSuccessMessage, PaymentErrorMessage } from "#messages/Payment.js";
import { chanelKeyboard, chanelPrivateKeyboard, resultKeyboard } from "#keyboards/Channel.js";
import { MainMenuKeyboard, DeleteKeyboard } from "#keyboards/Main.js";

// Логирование
import logger from "#utils/logs.js";

// Контроллер "Отправка поста раздачи"
export async function sendPromotionPost(telegram, promotion, counter = null) {
	try {
		// Отправляем сообщение в открытый канал
		const { message_id: public_id } = await telegram.telegram.sendPhoto(
			process.env.TELEGRAM_GROUP_ID,
			promotion.image,
			{
				caption: `${promotion.title}\n\n${promotion.description}`,
				parse_mode: 'HTML',
				reply_markup: promotion.is_private ? chanelKeyboard(promotion).reply_markup : chanelPrivateKeyboard(promotion, counter).reply_markup,
			}
		)

		// Отправляем сообщение в приватный канал
		const { message_id: private_id } = await telegram.telegram.sendPhoto(
			process.env.TELEGRAM_GROUP_PRIVATE_ID,
			promotion.image,
			{
				caption: `${promotion.title}\n\n${promotion.description}`,
				parse_mode: 'HTML',
				reply_markup: chanelPrivateKeyboard(promotion, counter).reply_markup,
			}
		)

		return { public_id, private_id }
	} catch (e) {
		logger.error('Ошибка отправки поста в телеграм:', e);
	}
};

// Контроллер "Отправка поста результатов"
export async function sendResultPost(telegram, promotion, winners) {
	try {
		// Отправляем сообщение в открытый канал
		const { message_id: public_result_id } = await telegram.telegram.sendMessage(
			process.env.TELEGRAM_GROUP_ID,
			ResultMessage(promotion, winners),
			{
				reply_to_message_id: promotion.messages.public_id,
				disable_web_page_preview: true,
				parse_mode: 'HTML'
			}
		);

		// Отправляем сообщение в закрытый канал
		const { message_id: private_result_id } = await telegram.telegram.sendMessage(
			process.env.TELEGRAM_GROUP_PRIVATE_ID,
			ResultMessage(promotion, winners),
			{
				reply_to_message_id: promotion.messages.private_id,
				disable_web_page_preview: true,
				parse_mode: 'HTML'
			}
		);

		return { public_result_id, private_result_id }
	} catch (e) {
		logger.error('Ошибка отправки поста в телеграм:', e);
	}
};

// Контроллер "Обновление поста раздачи"
export async function updatePost(telegram, promotion, counter = null, retries = 3) {
	try {
		// Проверяем данные
		if (!promotion.messages.private_id || !promotion.messages.public_id) { throw new Error('Не указан id сообщений.') }

		if (!promotion.is_private) {
			await telegram.telegram.editMessageCaption(
				process.env.TELEGRAM_GROUP_ID,
				promotion.messages.public_id,
				null,
				`${promotion.title}\n\n${promotion.description}`,
				{
					parse_mode: 'HTML',
					reply_markup: counter ? chanelPrivateKeyboard(promotion, counter).reply_markup : resultKeyboard(promotion).reply_markup,
				}
			);
		}

		await telegram.telegram.editMessageCaption(
			process.env.TELEGRAM_GROUP_PRIVATE_ID,
			promotion.messages.private_id,
			null,
			`${promotion.title}\n\n${promotion.description}`,
			{
				parse_mode: 'HTML',
				reply_markup: counter ? chanelPrivateKeyboard(promotion, counter).reply_markup : resultKeyboard(promotion).reply_markup,
			}
		);

	} catch (e) {
		if (e.message.includes('429: Too Many Requests') && retries > 0) {
			const retryAfterMatch = e.message.match(/retry after (\d+)/);
			const retryAfter = retryAfterMatch ? parseInt(retryAfterMatch[1], 10) * 1000 : 5000;
			logger.warn(`Получена ошибка 429, повтор через ${retryAfter / 1000} секунд. Осталось попыток: ${retries}`);

			await new Promise(resolve => setTimeout(resolve, retryAfter));
			return await updatePost(telegram, promotion, counter, retries - 1);
		} else {
			logger.error('Ошибка обновления поста в Telegram:', e);
			throw e;
		}
	}
};

// Контроллер "Уведомление о победе в личном сообщении"
export async function sendWinnerPost(telegram, promotion, user) {
	try {
		const post = `${process.env.TELEGRAM_CHANEL_URL}/${promotion.messages.public_id}`;

		return await telegram.telegram.sendMessage(
			user.telegram_id,
			WinnerMessage(promotion, post),
			{
				parse_mode: 'HTML',
				disable_web_page_preview: false,
				reply_markup: MainMenuKeyboard().reply_markup
			}
		);
	} catch (e) {
		logger.error('Ошибка отправки поста с победителями:', e);
	}
};

// Контроллер "Уведомление об успешной подписке"
export async function sendSubscribeSuccesPost(telegram, user) {
	try {
		return await telegram.telegram.sendMessage(
			user,
			PaymentSuccessMessage(),
			{
				parse_mode: 'HTML',
				disable_web_page_preview: false,
				reply_markup: DeleteKeyboard().reply_markup
			}
		);
	} catch (e) {
		logger.error('Ошибка отправки поста с победителями:', e);
	}
};

// Контроллер "Уведомление об неуспешной подписке"
export async function sendSubscribeFailedPost(telegram, user) {
	try {
		return await telegram.telegram.sendMessage(
			user,
			PaymentErrorMessage(),
			{
				parse_mode: 'HTML',
				disable_web_page_preview: false,
				reply_markup: chanelKeyboard().reply_markup
			}
		);
	} catch (e) {
		logger.error('Ошибка отправки поста с победителями:', e);
	}
};