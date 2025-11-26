// Импорты
import { getUser, updateUser } from "#controllers/User.js";
import { setTransaction } from "#controllers/Transaction.js";
import { setAllParticipants, deleteAllParticipants } from "#controllers/Participants.js";
import { sendSubscribeSuccesPost, sendSubscribeFailedPost } from "#controllers/Telegram.js";

// Логирование
import logger from "#utils/logs.js";

// Маршруты "Уведомления о подписке"
export default async function (app, telegram) {
	// Проверка подписки на канал
	app.post('/notification', async (req, res) => {
		try {
			const data = req.body;
			const { name, payload } = data;

			// Добавление новой подписки
			if (name === "new_subscription") {
				const user = await getUser(payload.telegram_user_id);
				// Создаём транзакцию
				await setTransaction({
					telegram_id: payload.telegram_user_id,
					subscription_id: payload.subscription_id,
					price: payload.price / 100,
					period: payload.period
				});
				// Обновляем данные подписки
				await updateUser(payload.telegram_user_id, {
					subscriptions: {
						...user.subscriptions,
						private: {
							tribute_id: payload.subscription_id,
							is_subscribe: true,
							period: payload.period,
							expires_at: payload.expires_at
						}
					}
				})
				// Добавляем участие в раздачах
				await setAllParticipants(user._id)
				// Отправляем уведомление пользователю
				await sendSubscribeSuccesPost(telegram, payload.telegram_user_id);
				logger.info(`Новая подписка: ID:${payload.subscription_id}`);
				return res.status(200).json({ status: "success" });
			}

			// Удаление подписки
			if (name === "cancelled_subscription") {
				const user = await getUser(payload.telegram_user_id);
				// Обновляем данные подписки
				await updateUser(payload.telegram_user_id, {
					subscriptions: {
						...user.subscriptions,
						private: {
							tribute_id: null,
							is_subscribe: false,
							period: null,
							expires_at: null
						}
					}
				})
				// Удаляем участие из раздач
				await deleteAllParticipants(user._id);
				// Отправляем уведомление пользователю
				await sendSubscribeFailedPost(telegram, payload.telegram_user_id);
				logger.info(`Удалена подписка ID:${payload.subscription_id}`);
				return res.status(200).json({ status: "success" });
			}

			// Логирование
			logger.warn(`Необработанный тип уведомления`);
			return res.status(200).json({ status: "success" });
		} catch (e) {
			logger.info(`Ошибка получения уведомлений:`, e);
			return res.status(500).json({ status: "fail" });
		}
	});
}