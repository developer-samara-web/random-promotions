// services/scheduleService.mjs
import nodeSchedule from 'node-schedule';
import { getSchedules, updateSchedule, delSchedule } from "#controllers/scheduleController.js";
import { getPromotion, updatePromotion } from "#controllers/promotionController.js";
import { addPost } from "#controllers/telegramController.js";

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
        logger.info(`Получаю задачи: ${schedules.length} шт`);
    } catch (error) {
        logger.error('Ошибка инициализации задачи:', error);
        throw error;
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
                await addPost(telegram, promotion);
                // Обновляем статус задачи
                await updateSchedule(_id, { status: 'active' });
                // Обновляем статус акции
                await updatePromotion(promotion_id, { is_published: 'active' });
                logger.info(`Акция ${promotion_id} опубликована`);
            } catch (error) {
                logger.error(`Ошибка публикации акции ${promotion_id}:`, error);
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
                await updatePromotion(promotion_id, { status: 'completed' });
                // Удаляем задачу из базы
                await delSchedule(_id);
                logger.info(`Promotion ${promotion_id} completed and removed`);
            } catch (error) {
                logger.error(`Failed to complete promotion ${promotion_id}:`, error);
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