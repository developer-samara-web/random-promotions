// Импорты
import { getSchedules } from "#controllers/scheduleController.js";
import { addPromotionSchedule } from "#schedules/Promotions.js";

// Логирование
import logger from "#utils/logs.js";

// Стек планировщика
const scheduledJobs = new Map();

// Инициализация планировщика
export async function initSchedule (telegram) {
    try {
        // Получаем все задачи
        const schedules = await getSchedules();
        // Проверяем данные и добавляем задачи в планировщик
        if (schedules) { schedules.forEach(schedule => addSchedule(schedule, telegram)) }
        logger.info(`Получено задач: ${schedules.length} шт.`);
    } catch (e) {
        logger.error('Ошибка инициализации задачи:', e);
    }
}

// Добавление задачи в планировщик
export async function addSchedule(schedule, telegram) {
    // Получаем тип задачи
    const { type } = schedule;
    // Проверяем тип задачи
    if (type === 'promotion') {
        return addPromotionSchedule(schedule, telegram, scheduledJobs);
    } else if (type === 'subscription') {
        return addSubscriptionSchedule(schedule, telegram, scheduledJobs);
    } else {
        logger.error(`Неизвестный тип задачи: ${type}`);
        return null;
    }
}