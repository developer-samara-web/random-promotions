// services/scheduleService.mjs
import nodeSchedule from 'node-schedule';
import { getSchedules, updateSchedule, delSchedule } from "#controllers/scheduleController.js";
import { getPromotion, updatePromotion } from "#controllers/promotionController.js";
import { sendPromotionPost, sendResultPost, updatePost, sendWinnerPost } from "#controllers/telegramController.js";
import { getParticipantsWinners } from "#controllers/participantsController.js";
import { updateWinners } from "#controllers/userController.js";
import randomUsers from "#utils/randomUser.js";
import checkWinners from "#utils/checkWinners.js";

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
                // Получаем все участия в акциях
                const participants = await getParticipantsWinners({ promotion_id });
                // Создаем переменную с победителями
                let winners;
                // Проверяем данные
                if (participants) {
                    // Получаем обычных пользователей
                    const premiumUsers = participants
                        .filter(participant => participant.user_id?.subscription?.is_active === true)
                        .map(participant => participant.user_id);
                    // Получаем премиум пользователей
                    const freeUsers = participants
                        .filter(participant => participant.user_id?.subscription?.is_active === false)
                        .map(participant => participant.user_id);
                    // Если нет премиум пользователей
                    if (!premiumUsers.length) {
                        // Проверяем победы обычных пользователей
                        const freeWinnersLastMonth = checkWinners(freeUsers);
                        const neededFreeWinnersCount = promotion.winners_count - freeWinnersLastMonth.length;
                        // Если все обычные пользователи побеждали в этом месяце то просто рандом
                        if (freeWinnersLastMonth.length >= promotion.winners_count) {
                            // Если достаточно пользователей, не побеждавших в этом месяце
                            winners = randomUsers(freeWinnersLastMonth, promotion.winners_count);
                        } else if (freeUsers.length >= neededFreeWinnersCount) {
                            // Если недостаточно "чистых" победителей, но хватает обычных пользователей
                            const winnersFromLastMonth = randomUsers(freeWinnersLastMonth, freeWinnersLastMonth.length);
                            const additionalWinners = randomUsers(freeUsers, neededFreeWinnersCount);
                            winners = [...winnersFromLastMonth, ...additionalWinners];
                        } else {
                            // Если вообще недостаточно пользователей
                            const allPossibleWinners = [...freeWinnersLastMonth, ...freeUsers];
                            winners = randomUsers(allPossibleWinners, Math.min(promotion.winners_count, allPossibleWinners.length));
                            console.warn(`Недостаточно пользователей для выбора ${promotion.winners_count} победителей!`);
                        }
                    } else {
                        // Проверяем победы премиум пользователей
                        const premiumWinnersLastMonth = checkWinners(premiumUsers);
                        const neededPremiumWinnersCount = promotion.winners_count - premiumWinnersLastMonth.length;
                        // Если все обычные пользователи побеждали в этом месяце то просто рандом
                        if (premiumWinnersLastMonth.length >= promotion.winners_count) {
                            // Если достаточно пользователей, не побеждавших в этом месяце
                            winners = randomUsers(premiumWinnersLastMonth, promotion.winners_count);
                        } else if (premiumUsers.length >= neededPremiumWinnersCount) {
                            // Если недостаточно "чистых" победителей, но хватает обычных пользователей
                            const winnersFromLastMonth = randomUsers(premiumWinnersLastMonth, premiumWinnersLastMonth.length);
                            const additionalWinners = randomUsers(premiumUsers, neededPremiumWinnersCount);
                            winners = [...winnersFromLastMonth, ...additionalWinners];
                        } else {
                            // Если вообще недостаточно пользователей
                            const allPossibleWinners = [...premiumWinnersLastMonth, ...premiumUsers];
                            winners = randomUsers(allPossibleWinners, Math.min(promotion.winners_count, allPossibleWinners.length));
                            console.warn(`Недостаточно пользователей для выбора ${promotion.winners_count} победителей!`);
                        }
                    }
                }
                // Обновляем статус и даты победителей и проигравших
                const update = await updateWinners(participants, winners);
                // Отправляет сообщение с результатами
                await sendResultPost(telegram, promotion, update);
                // Отправляем сообщения победителям
                winners.forEach(async winner => {
                    try {
                        await sendWinnerPost(telegram, promotion, winner)
                    } catch (e) {
                        logger.error(`Ошибка отправки сообщения победителю ${winner.telegram_id}:`, e);
                    }
                });
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