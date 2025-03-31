// Импорты
import connectToDatabase from "#services/mongodb.js";
import User from "#models/User.js";
import Participant from "#models/Participant.js";

// Логирование
import logger from "#utils/logs.js";

// Получение пользователя
export async function getUser(id) {
	try {
		// Проверка входных данных
		if (!id) { throw new Error('Ошибка данных, id не заполнен.') };
		// Подключаемся к базе
		await connectToDatabase();
		// Получаем пользователя
		const user = await User.findOne({ telegram_id: id });
		// Проверяем данные
		if (!user) { return null };
		// Отправляем данные
		return user;
	} catch (e) {
		logger.error('Ошибка получения пользователя:', e);
	}
};

// Получаем пользователей
export async function getUsers(body) {
	try {
		// Проверка входных данных
		if (!body) { throw new Error('Ошибка данных, body не заполнен.') };
		// Подключаемся к базе
		await connectToDatabase();
		// Получаем пользователя
		const users = await User.find(body);
		// Проверяем данные
		if (!users) { return null };
		// Отправляем данные
		return users;
	} catch (e) {
		logger.error('Ошибка получения пользователей:', e);
	}
}

// Регистрация пользователя
export async function setUser(body) {
	try {
		// Проверка входных данных
		if (!body) { throw new Error('Ошибка данных, body не заполнен.') };
		// Подключаемся к базе
		await connectToDatabase();
		// Создаём нового пользователя
		const user = new User(body);
		// Сохраняем в базе
		await user.save();
		// Проверка данных
		if (!user) { return null };
		// Отправляем данные
		logger.info(`Пользователь создан: ${user._id}`);
		return user;
	} catch (e) {
		logger.error('Ошибка создания пользователя:', e);
	}
};

// Обновление пользователя
export async function updateUser(id, body) {
	try {
		// Проверка входных данных
		if (!id || !body) { throw new Error('Ошибка данных, id или body не заполнены.') };
		// Подключаемся к базе
		await connectToDatabase();
		// Обновляем данные
		const user = await User.findOneAndUpdate(
			{ telegram_id: id },
			{ $set: body },
			{ new: true }
		);

		User.find
		// Проверка данных
		if (!user) { return null };
		// Отправляем данные
		logger.info(`Пользователь обновлён: ${user._id}`);
		return user;
	} catch (e) {
		logger.error('Ошибка обновления пользователя:', e);
	}
};

// Проверка подписки на канал
export async function checkUser(ctx) {
	try {
		// Проверка входных данных
		if (!ctx) { throw new Error('Ошибка данных, контекст не заполнен.') };
		// Получаем статус подписки пользователя
		const subscribe = await ctx.telegram.getChatMember(process.env.TELEGRAM_GROUP_ID, ctx.from.id);
		// Проверяем статус
		const isSubscribed = ['member', 'administrator', 'creator'].includes(subscribe.status);
		// Если не подписан
		if (!isSubscribed) { return false }
		// Отправляем данные
		return true;
	} catch (e) {
		logger.error('Ошибка проверки подписки на канал:', e);
	}
}

export async function updateWinners(participants, winners) {
	try {
		// Получаем текущую дату
		const currentDate = new Date();
		// Извлекаем ID участников
		const participantIds = participants.map(p => p._id);
		// Извлекаем ID победителей
		const winnerUserIds = winners.map(winner => winner._id);
		// Находим ID участников, являющихся победителями
		const winnerParticipantIds = participants
			.filter(p => winnerUserIds.includes(p.user_id._id))
			.map(p => p._id);
		// Обновляем победителей в Participant
		if (winnerParticipantIds.length > 0) {
			await Participant.updateMany(
				{ _id: { $in: winnerParticipantIds } },
				{ $set: { status: 'winner' } }
			);
			logger.info(`Обновили статусы победителей: ${winnerParticipantIds.length} шт`);
		}

		// Обновляем проигравших в Participant
		const loserParticipantIds = participantIds.filter(id => !winnerParticipantIds.includes(id));
		if (loserParticipantIds.length > 0) {
			await Participant.updateMany(
				{ _id: { $in: loserParticipantIds } },
				{ $set: { status: 'loser' } }
			);
			logger.info(`Обновили статусы проигравших: ${loserParticipantIds.length} шт`);
		}

		// Обновляем дату победы у победителей
		if (winnerUserIds.length > 0) {
			await User.updateMany(
				{ _id: { $in: winnerUserIds } },
				{ $set: { 'stats.last_win_date': currentDate } }
			);
			logger.info(`Обновили дату победы: ${winnerUserIds.length} шт`);
		}
		// Возвращаем список логинов победителей
		if (winners.length) {
			return winners.map(user => `@${user.username}`)
		} else {
			return ['Никто не участвовал в розыгрыше']
		}
	} catch (e) {
		logger.error('Ошибка обновления победителей:', e);
	}
}