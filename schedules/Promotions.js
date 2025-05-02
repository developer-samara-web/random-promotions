// Импорты
import nodeSchedule from 'node-schedule';
import { sendPromotionPost, sendResultPost, updatePost, sendWinnerPost } from "#controllers/Telegram.js";
import { updateSchedule } from "#controllers/Schedule.js";
import { getPromotion, updatePromotion } from "#controllers/Promotion.js";
import { getParticipantsWinners } from "#controllers/Participants.js";
import { updateWinners } from "#controllers/User.js";
import cancelSchedule from '#utils/cancelSchedule.js';
import randomUsers from "#utils/randomUser.js";
import checkWinners from "#utils/checkWinners.js";

// Логирование
import logger from "#utils/logs.js";

// Добавление задачи для промоушена
export function addPromotionSchedule(schedule, telegram, scheduledJobs) {
    const { _id, start_date, end_date, promotion_id } = schedule;
    const jobName = `promotion_${_id}`;

    cancelSchedule(jobName, scheduledJobs);

    const publishJob = nodeSchedule.scheduleJob(
        `${jobName}_start`,
        start_date,
        async () => {
            try {
                const promotion = await getPromotion(promotion_id);
                const { message_id } = await sendPromotionPost(telegram, promotion);
                await updateSchedule(_id, { status: 'in_progress' });
                await updatePromotion(promotion_id, { status: 'active', message_id });
                logger.info(`Публикуем: ID:${promotion_id}`);
            } catch (e) {
                logger.error(`Ошибка публикации (${promotion_id}):`, e);
            }
        }
    );

    const endJob = nodeSchedule.scheduleJob(
        `${jobName}_end`,
        end_date,
        async () => {
            try {
                const promotion = await updatePromotion(promotion_id, { status: 'completed' });
                await updatePost(telegram, promotion);
                const participants = await getParticipantsWinners({ promotion_id });
                let winners = [];
                if (participants) {
                    const premiumUsers = participants
                        .filter(p => p.user_id?.subscription?.is_active && p.user_id?.channel_subscription)
                        .map(p => p.user_id);
                    const freeUsers = participants
                        .filter(p => !p.user_id?.subscription?.is_active && p.user_id?.channel_subscription)
                        .map(p => p.user_id);

                    if (!promotion.requires_subscription) {
                        const premiumNotWinners = checkWinners(premiumUsers) || [];
                        const premiumWinnersThisMonth = premiumUsers.filter(u => !premiumNotWinners.some(n => n._id === u._id));
                        const freeNotWinners = checkWinners(freeUsers) || [];
                        const freeWinnersThisMonth = freeUsers.filter(u => !freeNotWinners.some(n => n._id === u._id));
                        const allWinnersThisMonth = [...premiumWinnersThisMonth, ...freeWinnersThisMonth];
                        let remainingWinnersCount = promotion.winners_count;

                        if (premiumNotWinners.length > 0 && remainingWinnersCount > 0) {
                            const premiumCount = Math.min(remainingWinnersCount, premiumNotWinners.length);
                            winners = [...randomUsers(premiumNotWinners, premiumCount)];
                            remainingWinnersCount -= premiumCount;
                        }
                        if (freeNotWinners.length > 0 && remainingWinnersCount > 0) {
                            const freeCount = Math.min(remainingWinnersCount, freeNotWinners.length);
                            winners = [...winners, ...randomUsers(freeNotWinners, freeCount)];
                            remainingWinnersCount -= freeCount;
                        }
                        if (allWinnersThisMonth.length > 0 && remainingWinnersCount > 0) {
                            const winnersCount = Math.min(remainingWinnersCount, allWinnersThisMonth.length);
                            winners = [...winners, ...randomUsers(allWinnersThisMonth, winnersCount)];
                        }
                    } else {
                        const premiumNotWinners = checkWinners(premiumUsers) || [];
                        const premiumWinnersThisMonth = premiumUsers.filter(u => !premiumNotWinners.some(n => n._id === u._id));
                        let remainingWinnersCount = promotion.winners_count;

                        if (premiumNotWinners.length > 0 && remainingWinnersCount > 0) {
                            const premiumCount = Math.min(remainingWinnersCount, premiumNotWinners.length);
                            winners = [...randomUsers(premiumNotWinners, premiumCount)];
                            remainingWinnersCount -= premiumCount;
                        }
                        if (premiumWinnersThisMonth.length > 0 && remainingWinnersCount > 0) {
                            const winnersCount = Math.min(remainingWinnersCount, premiumWinnersThisMonth.length);
                            winners = [...winners, ...randomUsers(premiumWinnersThisMonth, winnersCount)];
                        }
                    }
                }
                const update = await updateWinners(participants, winners);
                await sendResultPost(telegram, promotion, update);
                winners.forEach(async winner => {
                    try {
                        await sendWinnerPost(telegram, promotion, winner);
                    } catch (e) {
                        logger.error(`Ошибка отправки сообщения победителю ${winner.telegram_id}:`, e);
                    }
                });
                await updateSchedule(_id, { status: 'completed' });
                logger.info(`Раздача завершена: ID:${promotion_id}`);
            } catch (e) {
                logger.error(`Ошибка завершения акции ${promotion_id}:`, e);
            } finally {
                cancelSchedule(jobName, scheduledJobs);
            }
        }
    );

    scheduledJobs.set(`${jobName}_start`, publishJob);
    scheduledJobs.set(`${jobName}_end`, endJob);

    return jobName;
}