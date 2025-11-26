// Импорты
import nodeSchedule from 'node-schedule';
import { sendPromotionPost, sendResultPost, updatePost, sendWinnerPost } from "#controllers/Telegram.js";
import { getUsers } from "#controllers/User.js";
import { updateSchedule } from "#controllers/Schedule.js";
import { getPromotion, updatePromotion } from "#controllers/Promotion.js";
import { getParticipantsWinners, setParticipants } from "#controllers/Participants.js";
import { updateWinners } from "#controllers/User.js";
import cancelSchedule from '#utils/cancelSchedule.js';
import randomUsers from "#utils/randomUser.js";
import checkWinners from "#utils/checkWinners.js";

// Логирование
import logger from "#utils/logs.js";
import { message } from 'telegraf/filters';

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
				// Получаем раздачу
				const promotion = await getPromotion(promotion_id);
				// Получаем всех премиум пользователей
				const private_users = await getUsers({ "subscriptions.private.is_subscribe": true });
				// Добавляем всех премиум пользователей в участники
				const participants = await setParticipants(promotion_id, private_users);
				// Отправляем пост о начале раздачи
				const messages = await sendPromotionPost(telegram, promotion, participants);
				// Обновляем статус задачи и раздачи
				await updateSchedule(_id, { status: 'in_progress' });
				// Обновляем раздачу с ID сообщений
				await updatePromotion(promotion_id, { status: 'active', messages });
				// Логируем
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
				// Обновляем статус раздачи
				const promotion = await updatePromotion(promotion_id, { status: 'completed' });
				// Удаляем кнопку из поста
				await updatePost(telegram, promotion);
				// Получаем все участия в раздаче
				const participants = await getParticipantsWinners({ promotion_id });
				// Массив победителей
				let winners = [];
				if (participants) {
					// Получаем всех премиум пользователей
					const premiumUsers = participants
						.filter(p => p.user_id?.subscriptions?.private?.is_subscribe && p.user_id?.subscriptions?.public.is_subscribe)
						.map(p => p.user_id);
					// Получаем обычных пользователей
					const freeUsers = participants
						.filter(p => !p.user_id?.subscriptions?.private?.is_subscribe && p.user_id?.subscriptions?.public.is_subscribe)
						.map(p => p.user_id);
					// Выбираем победителей
					if (!promotion.is_private) {
						const premiumNotWinners = checkWinners(premiumUsers) || [];
						const premiumWinnersThisMonth = premiumUsers.filter(u => !premiumNotWinners.some(n => n._id === u._id));
						const freeNotWinners = checkWinners(freeUsers) || [];
						const freeWinnersThisMonth = freeUsers.filter(u => !freeNotWinners.some(n => n._id === u._id));
						const allWinnersThisMonth = [...premiumWinnersThisMonth, ...freeWinnersThisMonth];
						let remainingWinnersCount = promotion.count;

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
						let remainingWinnersCount = promotion.count;

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
				// Обновляем участников
				const update = await updateWinners(participants, winners);
				// Отправляем пост с результатами
				const { public_result_id, private_result_id } = await sendResultPost(telegram, promotion, update);
				// // Обновляем раздачу с ID сообщений результатов
				// await updatePromotion(promotion_id, {
				// 	messages: {
				// 		...promotion.messages,
				// 		public_result_id,
				// 		private_result_id
				// 	}
				// });
				// Отправляем сообщения победителям
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
				logger.error(`Ошибка завершения раздачи ${promotion_id}:`, e);
			} finally {
				cancelSchedule(jobName, scheduledJobs);
			}
		}
	);

	scheduledJobs.set(`${jobName}_start`, publishJob);
	scheduledJobs.set(`${jobName}_end`, endJob);

	return jobName;
}