// services/scheduleService.mjs
import nodeSchedule from 'node-schedule';
import { getSchedules, updateSchedule, delSchedule } from "#controllers/scheduleController.js";
import { getPromotion, updatePromotion } from "#controllers/promotionController.js";
import { sendPromotionPost, sendResultPost, updatePost } from "#controllers/telegramController.js";

// Логирование
import logger from "#utils/logs.js";

// Стек планировщика
const scheduledJobs = new Map();

// Инициализация планировщика
export async function initScheduler(telegram) {
    try {
        // Получаем все задачи
        const schedules = await getSchedules();
        // Проверяем данные
        if (schedules) { schedules.forEach(schedule => addSchedule(schedule, telegram)) };
        logger.info(`Получено задач: ${schedules.length} шт.`);
    } catch (e) {
        logger.error('Ошибка инициализации задачи:', e);
    }
}

// Добавление задачи в планировщик
export function addSchedule(schedule, telegram) {
    const { _id, start_date, end_date, promotion_id } = schedule;
    const jobName = `promotion_${_id}`;

    // Отменяем существующие задачи для этого расписания
    cancelSchedule(jobName);

    // Задача для начала акции
    const publishJob = nodeSchedule.scheduleJob(
        `${jobName}_start`,
        start_date,
        async () => {
            try {
                // Получаем данные акции
                const promotion = await getPromotion(promotion_id);
                // Создаём пост
                const { message_id } = await sendPromotionPost(telegram, promotion);
                // Обновляем статус задачи
                await updateSchedule(_id, { status: 'in_progress' });
                // Обновляем статус акции
                await updatePromotion(promotion_id, { status: 'active', message_id });
                logger.info(`Публикуем: ${promotion_id}`);
            } catch (e) {
                logger.error(`Ошибка публикации (${promotion_id}):`, e);
            }
        }
    );

    // Задача для завершения акции
    const endJob = nodeSchedule.scheduleJob(
        `${jobName}_end`,
        end_date,
        async () => {
            try {
                // Обновляем статусы акции
                const promotion = await updatePromotion(promotion_id, { status: 'completed' });
                // Обновляем пост розыгрыша
                await updatePost(telegram, promotion);
                // Отправляет сообщение с результатами
                await sendResultPost(telegram, promotion);
                // Удаляем задачу из базы
                await delSchedule(_id);
                logger.info(`Акция завершена: ${promotion_id}`);
            } catch (e) {
                logger.error(`Ошибка завершения акции ${promotion_id}:`, e);
            } finally {
                // Позавершению удаляем задачу из расписания
                cancelSchedule(jobName);
            }
        }
    );

    // Сохраняем ссылки на задачи
    scheduledJobs.set(`${jobName}_start`, publishJob);
    scheduledJobs.set(`${jobName}_end`, endJob);

    return jobName;
}

// Отмена задач по имени
export function cancelSchedule(jobName) {
    const startJobKey = `${jobName}_start`;
    const endJobKey = `${jobName}_end`;

    if (scheduledJobs.has(startJobKey)) {
        scheduledJobs.get(startJobKey).cancel();
        scheduledJobs.delete(startJobKey);
    }

    if (scheduledJobs.has(endJobKey)) {
        scheduledJobs.get(endJobKey).cancel();
        scheduledJobs.delete(endJobKey);
    }
}