// Импорты
import { initSchedule } from "#services/Schedule.js";
import { updateTransaction } from "#controllers/Transaction.js";
import { updateUser, updateUserById } from "#controllers/User.js";
import { sendPaymentSuccesPost, sendPaymentFailedPost } from "#controllers/Telegram.js";
import { setSchedule } from "#controllers/Schedule.js";
import { getTariff } from "#controllers/Tariff.js";
import calculatePeriod from "#utils/calculatePeriod.js";

// Логирование
import logger from "#utils/logs.js";

// Обработчик "Подтверждение платежа"
export async function PaymentCheckout(Telegram) {
	Telegram.on('pre_checkout_query', async (ctx) => {
		try {
			// Получаем данные call-бэка
			const { userId, transactionId } = JSON.parse(ctx.preCheckoutQuery.invoice_payload);
			// Подтверждаем платёж
			await ctx.answerPreCheckoutQuery(true);
			// Обновляем статус транзакции
			await updateTransaction(transactionId, { status: 'accepted' });
			// Логируем
			logger.info(`Успешное подтверждение оплаты: ID:${userId}`);
		} catch (e) {
			await ctx.answerPreCheckoutQuery(false, 'Ошибка обработки платежа.');
			const { message_id } = await updateTransaction(transactionId, { status: 'failed' });
			await sendPaymentFailedPost(Telegram, ctx.message.chat.id, message_id, user);
			logger.error(`Ошибка подтверждения оплаты:`, e);
		}
	});
};

// Обработчик "Успешный платёж"
export async function PaymentSuccess(Telegram) {
	Telegram.on('successful_payment', async (ctx) => {
		try {
			// Получаем данные call-бэка
			const { userId, transactionId, tariffId } = JSON.parse(ctx.message.successful_payment.invoice_payload);
			// Обновляем статус транзакции
			const { message_id } = await updateTransaction(transactionId, { status: 'completed' });
			// Получаем данные тарифа
			const tariff = await getTariff(tariffId);
			// Получаем данные пользователя
			const user = await updateUserById(userId, {});
			// Получаем период дат
			const { start_date, end_date } = calculatePeriod(tariff.duration);
			// Меняем статус пользователя
			await updateUser(user.telegram_id, {
				'subscription.is_active': true,
				'subscription.is_auto_renewal': true,
				'subscription.start_date': start_date,
				'subscription.end_date': end_date
			});
			// Создаём график снятия премиума
			await setSchedule({ user_id: userId, tariff_id: tariffId, type: 'subscription', start_date, end_date });
			// Отправляем сообщение
			await sendPaymentSuccesPost(Telegram, ctx.message.chat.id, message_id, end_date);
			// Обновляем задачи
			initSchedule(Telegram);
			// Логируем
			logger.info(`Успешное оплата премиума: ID:${userId}`);
		} catch (e) {
			logger.error('Ошибка успешной оплаты:', e);
		}
	});
};
