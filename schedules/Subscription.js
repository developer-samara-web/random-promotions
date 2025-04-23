// Импорты
import nodeSchedule from 'node-schedule';
import { updateUserById } from "#controllers/userController.js";
import { getTransactions } from "#controllers/transactionController.js";
import { updateSchedule } from '#controllers/scheduleController.js';
import cancelSchedule from '#utils/cancelSchedule.js';

// Логирование
import logger from "#utils/logs.js";

// Добавление задачи для проверки подписки
export function addSubscriptionSchedule(schedule, telegram, scheduledJobs) {
    const { _id, user_id, end_date } = schedule;
    const jobName = `subscription_${_id}`;

    cancelSchedule(jobName, scheduledJobs);

    // Отключение подписки с предварительной проверкой оплаты
    const disableJob = nodeSchedule.scheduleJob(
        `${jobName}_disable`,
        end_date,
        async () => {
            try {
                // Получаем кол-во удачных транзакций
                const transactions = await getTransactions(user_id);
                // Получаем данные пользователя и тарифа
                await updateUserById(user_id, {
                    'subscription.is_active': false,
                    'subscription.is_auto_renewal': false,
                    'subscription.start_date': null,
                    'subscription.end_date': null,
                    'subscription.renewal_count': transactions.length,
                });
                // Меняем статус задачи
                await updateSchedule(_id, { status: 'completed' });

                logger.info(`Отключаем премиум: ID:${user_id}`);
            } catch (e) {
                logger.error(`Ошибка отключения подписки для ${user_id}:`, e);
            }
        }
    );

    // Выполняем задачу
    scheduledJobs.set(`${jobName}_disable`, disableJob);

    return jobName;
}