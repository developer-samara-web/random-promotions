// Импорты
import { updateUserById } from "#controllers/userController.js";
import { updateTransaction, getTransactions } from "#controllers/transactionController.js";
import { sendPaymentSuccesPost, sendPaymentFailedPost} from "#controllers/telegramController.js"
import { setSchedule } from "#controllers/scheduleController.js";
import { getTariff } from "#controllers/tariffController.js";
import { initSchedule } from "#services/schedule.js";
import calculatePeriod from "#utils/calculatePeriod.js";

// Логирование
import logger from "#utils/logs.js";

// Маршруты "Уведомления о транзакциях"
export default async function (app, telegram) {
    app.post('/notification', async (req, res) => {
        try {
            // Получаем данные
            const { Success, OrderId, CardId, Status } = req.body;
            // Получаем транзакцию
            const transaction = await updateTransaction(OrderId, {});
            // Если транзакции не существует
            if (!transaction) return res.status(200).send('200 OK');
            // Получаем пользователя
            const user = await updateUserById(transaction.user_id, {});
            // Если пользователя не существует
            if (!user) return res.status(200).send('200 OK');

            logger.info(`Новое уведомление: USER:${user._id} - ORDER:${OrderId} - ${Status} - ${Success}`);

            // Успешная транзакция
            if (Success) {
                // Если платёж подтверждён
                if (Status === 'CONFIRMED') {
                    // Обновляем транзакцию
                    const { tariff_id } = await updateTransaction(OrderId, { status: 'completed' });
                    // Получаем период действия оплаченной подписки
                    const { duration } = await getTariff(tariff_id);
                    // Вычисляем даты начала и окончания подписки
                    let { start_date, end_date } = calculatePeriod(duration);
                    // Получаем кол-во удачных транзакций
                    const transactions = await getTransactions(user._id);
                    // Обновляем пользователя
                    await updateUserById(user._id, {
                        'subscription.is_active': true,
                        'subscription.is_auto_renewal': true,
                        'subscription.card_id': CardId,
                        'subscription.start_date': start_date,
                        'subscription.end_date': end_date,
                        'subscription.renewal_count': transactions.length,
                    });
                    // Создать задачу в базе
                    await setSchedule({ user_id: user._id, tariff_id: tariff_id, type: 'subscription', start_date, end_date });
                    // Отправляем сообщение
                    await sendPaymentSuccesPost(telegram, user);
                    // Обновляем задачи
                    initSchedule(telegram);
                    logger.info(`Успешная оплата: ID:${user._id}`);
                }
            } else {
                // Обновляем транзакцию
                await updateTransaction(OrderId, { status: 'failed' });
                // Отправляем сообщение
                await sendPaymentFailedPost(telegram, user);
                logger.info(`Неудачная оплата: ID:${user._id}`);
            }
            // Отправляем ответ
            return res.status(200).send('200 OK');
        } catch (e) {
            logger.info(`Ошибка получения уведомлений:`, e);
            return res.status(200).send('200 OK');
        }
    });
}