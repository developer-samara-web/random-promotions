// Импорты
import { updateUserById } from "#controllers/User.js";
import { getSubscribe } from "#controllers/Subscribe.js";
import { sendPaymentSuccesPost, sendPaymentFailedPost } from "#controllers/Telegram.js";

// Логирование
import logger from "#utils/logs.js";

// Маршруты "Уведомления о подписке"
export default async function (app, telegram) {
    // Проверка подписки на канал
    app.post('/notification', async (req, res) => {
        try {
            const { SubscriptionId, AccountId, Status, NextTransactionDate, SuccessfulTransactionsNumber } = req.body;
            const user = await updateUserById(AccountId, {});

            // Если подписка активна
            if (Status === "Active") {
                await updateUserById(AccountId, {
                    'subscription.end_date': NextTransactionDate,
                    'subscription.renewal_count': SuccessfulTransactionsNumber,
                })

                // Сообщение пользователю
                await sendPaymentSuccesPost(telegram, user, NextTransactionDate);

                logger.info(`Оплата подписки: ID:${AccountId}`);
            }

            // Если подписка повторно оплачена
            if (Status === "Completed") {
                if (SubscriptionId) {
                    const { Model } = await getSubscribe(SubscriptionId);

                    await updateUserById(AccountId, {
                        'subscription.is_active': true,
                        'subscription.is_auto_renewal': true,
                        'subscription.id': SubscriptionId,
                        'subscription.start_date': new Date(),
                        'subscription.end_date': Model.NextTransactionDateIso,
                        'subscription.renewal_count': Model.SuccessfulTransactionsNumber,
                    })

                    // Сообщение пользователю
                    await sendPaymentSuccesPost(telegram, user, Model.NextTransactionDate);
                }

                logger.info(`Оплата подписки: ID:${AccountId}`);
            }

            // Если подписка повторно оплачена
            if (Status === "Expired") {
                await updateUserById(AccountId, {
                    'subscription.is_active': false,
                    'subscription.is_auto_renewal': false,
                    'subscription.start_date': null,
                    'subscription.end_date': null,
                    'subscription.id': null
                })

                // Сообщение пользователю
                await sendPaymentFailedPost(telegram, user);

                logger.info(`Подписка истекла: ID:${AccountId}`);
            }

            // Если Транзакция не прошла 1-2 раза
            if (Status === "PastDue") {
                await updateUserById(AccountId, {
                    'subscription.is_active': false,
                    'subscription.is_auto_renewal': false,
                    'subscription.start_date': null,
                    'subscription.end_date': null,
                    'subscription.id': null
                })

                // Сообщение пользователю
                await sendPaymentFailedPost(telegram, user);

                logger.info(`Ошибка оплаты подписки 1-2: ID:${AccountId}`);
            }

            // Если Транзакция не прошла 3 раза
            if (Status === "Rejected") {
                await updateUserById(AccountId, {
                    'subscription.is_active': false,
                    'subscription.is_auto_renewal': false,
                    'subscription.start_date': null,
                    'subscription.end_date': null,
                    'subscription.id': null
                })

                // Сообщение пользователю
                await sendPaymentFailedPost(telegram, user);

                logger.info(`Ошибка оплаты подписки 3: ID:${AccountId}`);
            }

            // Если отменил подписку Status = Cancelled
            if (Status === "Cancelled") {
                await updateUserById(AccountId, {
                    'subscription.is_active': false,
                    'subscription.is_auto_renewal': false,
                    'subscription.start_date': null,
                    'subscription.end_date': null,
                    'subscription.id': null
                })

                // Сообщение пользователю
                await sendPaymentFailedPost(telegram, user);

                logger.info(`Отмена подписки: ID:${AccountId}`);
            }

            return res.status(200).json({ code: 0 });
        } catch (e) {
            logger.info(`Ошибка получения уведомлений:`, e);
            return res.status(500).json({ code: 0 });
        }
    });
}