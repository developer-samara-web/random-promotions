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
					let premiumUsers = participants
						.filter(p => p.user_id?.subscriptions?.private?.is_subscribe && p.user_id?.subscriptions?.public.is_subscribe)
						.map(p => p.user_id);

					// Получаем обычных пользователей
					let freeUsers = participants
						.filter(p => !p.user_id?.subscriptions?.private?.is_subscribe && p.user_id?.subscriptions?.public.is_subscribe)
						.map(p => p.user_id);

					if (!promotion.is_private) {
						// Проверяем, кто ещё не выигрывал
						let premiumNotWinners = checkWinners(premiumUsers) || [];
						let premiumWinnersThisMonth = premiumUsers.filter(u => !premiumNotWinners.some(n => n._id === u._id));
						let freeNotWinners = checkWinners(freeUsers) || [];
						let freeWinnersThisMonth = freeUsers.filter(u => !freeNotWinners.some(n => n._id === u._id));
						let allWinnersThisMonth = [...premiumWinnersThisMonth, ...freeWinnersThisMonth];

						let remainingWinnersCount = promotion.count;

						// Выбираем премиум, кто ещё не выигрывал
						if (premiumNotWinners.length > 0 && remainingWinnersCount > 0) {
							const count = Math.min(remainingWinnersCount, premiumNotWinners.length);
							const selected = randomUsers(premiumNotWinners, count);
							winners.push(...selected);
							remainingWinnersCount -= count;

							// Исключаем выбранных из следующих массивов
							const selectedIds = selected.map(u => u._id);
							freeNotWinners = freeNotWinners.filter(u => !selectedIds.includes(u._id));
							allWinnersThisMonth = allWinnersThisMonth.filter(u => !selectedIds.includes(u._id));
						}

						// Выбираем обычных, кто ещё не выигрывал
						if (freeNotWinners.length > 0 && remainingWinnersCount > 0) {
							const count = Math.min(remainingWinnersCount, freeNotWinners.length);
							const selected = randomUsers(freeNotWinners, count);
							winners.push(...selected);
							remainingWinnersCount -= count;

							const selectedIds = selected.map(u => u._id);
							allWinnersThisMonth = allWinnersThisMonth.filter(u => !selectedIds.includes(u._id));
						}

						// Выбираем всех остальных
						if (allWinnersThisMonth.length > 0 && remainingWinnersCount > 0) {
							const count = Math.min(remainingWinnersCount, allWinnersThisMonth.length);
							const selected = randomUsers(allWinnersThisMonth, count);
							winners.push(...selected);
							remainingWinnersCount -= count;
						}
					} else {
						// Приватная раздача — только премиум
						let premiumNotWinners = checkWinners(premiumUsers) || [];
						let premiumWinnersThisMonth = premiumUsers.filter(u => !premiumNotWinners.some(n => n._id === u._id));
						let remainingWinnersCount = promotion.count;

						if (premiumNotWinners.length > 0 && remainingWinnersCount > 0) {
							const count = Math.min(remainingWinnersCount, premiumNotWinners.length);
							const selected = randomUsers(premiumNotWinners, count);
							winners.push(...selected);
							remainingWinnersCount -= count;

							premiumWinnersThisMonth = premiumWinnersThisMonth.filter(u => !selected.map(s => s._id).includes(u._id));
						}

						if (premiumWinnersThisMonth.length > 0 && remainingWinnersCount > 0) {
							const count = Math.min(remainingWinnersCount, premiumWinnersThisMonth.length);
							const selected = randomUsers(premiumWinnersThisMonth, count);
							winners.push(...selected);
							remainingWinnersCount -= count;
						}
					}
				}
				// Обновляем участников
				const update = await updateWinners(participants, winners);
				// Отправляем пост с результатами
				await sendResultPost(telegram, promotion, update);
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