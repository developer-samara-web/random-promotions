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
                    console.log('Начальное количество участников:', participants.length);

                    // Получаем премиум пользователей
                    const premiumUsers = participants
                        .filter(participant =>
                            participant.user_id?.subscription?.is_active === true &&
                            participant.user_id?.channel_subscription === true
                        )
                        .map(participant => participant.user_id);

                    // Получаем бесплатных пользователей
                    const freeUsers = participants
                        .filter(participant =>
                            participant.user_id?.subscription?.is_active === false &&
                            participant.user_id?.channel_subscription === true
                        )
                        .map(participant => participant.user_id);

                    console.log('premiumUsers:', premiumUsers.length, premiumUsers);
                    console.log('freeUsers:', freeUsers.length, freeUsers);

                    // Проверяем тип акции
                    if (!promotion.requires_subscription) { // Обычная акция
                        console.log('Обрабатываем обычную акцию');

                        // Проверяем победы премиум пользователей
                        const premiumNotWinners = checkWinners(premiumUsers) || []; // Те, кто НЕ побеждал в текущем месяце
                        const premiumWinnersThisMonth = premiumUsers.filter(user =>
                            !premiumNotWinners.some(notWinner => notWinner._id === user._id)
                        );
                        console.log('Премиум не побеждавшие:', premiumNotWinners.length);
                        console.log('Премиум побеждавшие в этом месяце:', premiumWinnersThisMonth.length);

                        // Проверяем победы обычных пользователей
                        const freeNotWinners = checkWinners(freeUsers) || []; // Те, кто НЕ побеждал в текущем месяце
                        const freeWinnersThisMonth = freeUsers.filter(user =>
                            !freeNotWinners.some(notWinner => notWinner._id === user._id)
                        );
                        console.log('Обычные не побеждавшие:', freeNotWinners.length);
                        console.log('Обычные побеждавшие в этом месяце:', freeWinnersThisMonth.length);

                        // Все, кто выигрывал в этом месяце
                        const allWinnersThisMonth = [...premiumWinnersThisMonth, ...freeWinnersThisMonth];
                        console.log('Все побеждавшие в этом месяце:', allWinnersThisMonth.length);

                        winners = [];
                        let remainingWinnersCount = promotion.winners_count;

                        // 1. Премиум не побеждавшие
                        if (premiumNotWinners.length > 0 && remainingWinnersCount > 0) {
                            const premiumCount = Math.min(remainingWinnersCount, premiumNotWinners.length);
                            const premiumSelected = randomUsers(premiumNotWinners, premiumCount);
                            winners = [...premiumSelected];
                            remainingWinnersCount -= premiumCount;
                            console.log('Выбрано премиум не побеждавших:', premiumCount);
                        }

                        // 2. Обычные не побеждавшие
                        if (freeNotWinners.length > 0 && remainingWinnersCount > 0) {
                            const freeCount = Math.min(remainingWinnersCount, freeNotWinners.length);
                            const freeSelected = randomUsers(freeNotWinners, freeCount);
                            winners = [...winners, ...freeSelected];
                            remainingWinnersCount -= freeCount;
                            console.log('Выбрано обычных не побеждавших:', freeCount);
                        }

                        // 3. Любые побеждавшие
                        if (allWinnersThisMonth.length > 0 && remainingWinnersCount > 0) {
                            const winnersCount = Math.min(remainingWinnersCount, allWinnersThisMonth.length);
                            const winnersSelected = randomUsers(allWinnersThisMonth, winnersCount);
                            winners = [...winners, ...winnersSelected];
                            remainingWinnersCount -= winnersCount;
                            console.log('Выбрано из побеждавших:', winnersCount);
                        }

                        if (remainingWinnersCount > 0) {
                            console.warn(`Не удалось набрать ${promotion.winners_count} победителей, выбрано: ${winners.length}`);
                        }

                    } else { // Премиум акция
                        console.log('Обрабатываем премиум акцию');

                        const premiumNotWinners = checkWinners(premiumUsers) || []; // Те, кто НЕ побеждал в текущем месяце
                        const premiumWinnersThisMonth = premiumUsers.filter(user =>
                            !premiumNotWinners.some(notWinner => notWinner._id === user._id)
                        );

                        console.log('Премиум не побеждавшие:', premiumNotWinners.length);
                        console.log('Премиум побеждавшие в этом месяце:', premiumWinnersThisMonth.length);

                        winners = [];
                        let remainingWinnersCount = promotion.winners_count;

                        // 1. Премиум не побеждавшие
                        if (premiumNotWinners.length > 0 && remainingWinnersCount > 0) {
                            const premiumCount = Math.min(remainingWinnersCount, premiumNotWinners.length);
                            const premiumSelected = randomUsers(premiumNotWinners, premiumCount);
                            winners = [...premiumSelected];
                            remainingWinnersCount -= premiumCount;
                            console.log('Выбрано премиум не побеждавших:', premiumCount);
                        }

                        // 2. Премиум побеждавшие
                        if (premiumWinnersThisMonth.length > 0 && remainingWinnersCount > 0) {
                            const winnersCount = Math.min(remainingWinnersCount, premiumWinnersThisMonth.length);
                            const winnersSelected = randomUsers(premiumWinnersThisMonth, winnersCount);
                            winners = [...winners, ...winnersSelected];
                            remainingWinnersCount -= winnersCount;
                            console.log('Выбрано премиум побеждавших:', winnersCount);
                        }

                        if (remainingWinnersCount > 0) {
                            console.warn(`Не удалось набрать ${promotion.winners_count} победителей, выбрано: ${winners.length}`);
                        }
                    }

                    console.log('Итоговые победители:', winners.length, winners);
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