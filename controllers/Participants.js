// Импорты
import connectToDatabase from "#services/Mongodb.js";
import Participant from "#models/Participant.js";
import { getPromotions } from "#controllers/Promotion.js";
import User from "#models/User.js";

// Логирование
import logger from "#utils/logs.js";

// Контроллер "Получение всех участников раздач (число)"
export async function getParticipants(promotion_id) {
	try {
		// Подключаемся к базе
		await connectToDatabase();
		// Получаем раздачу
		const participants = await Participant.countDocuments(promotion_id ? { promotion_id: promotion_id } : {});
		// Проверяем данные
		if (!participants) { return null };
		// Отправляем данные
		return participants;
	} catch (e) {
		logger.error('Ошибка получения участий:', e);
	}
};

// Контроллер "Получение всех участников раздач"
export async function getParticipantsWinners(body) {
	try {
		// Проверка входных данных
		if (!body) { throw new Error('Ошибка данных, id не заполнен.') }
		// Подключаемся к базе
		await connectToDatabase();
		// Получаем раздачу
		const participants = await Participant.find(body).populate(
			{ path: 'user_id', model: 'User' },
		);
		// Проверяем данные
		if (!participants) { return null };
		// Отправляем данные
		return participants;
	} catch (e) {
		logger.error('Ошибка получения участий:', e);
	}
};

export async function setAllParticipants(user_id) {
	try {
		// Проверка входных данных
		if (!user_id) { throw new Error('Ошибка данных: user_id не указан.') }
		// Подключаемся к базе
		await connectToDatabase();
		// Получаем все активные промоакции
		const promotions = await getPromotions({ status: "active" });
		// Проверяем данные
		if (!promotions || promotions.length === 0) {
			return { success: true, message: 'Нет активных раздач', added: 0 };
		}
		// Формируем массив объектов для массовой вставки
		const participantsData = promotions.map(promotion => ({
			promotion_id: promotion._id || promotion.id,
			user_id: user_id,
			created_at: new Date(),
			updated_at: new Date()
		}));
		// Массовое добавление участников
		const result = await Participant.insertMany(participantsData, { ordered: false });
		return result;
	} catch (error) {
		logger.error('Ошибка добавления участий:', error);
	}
}

// Удаляет пользователя из всех актуальных (или всех) раздач
export async function deleteAllParticipants(user_id, { onlyActive = true } = {}) {
	try {
		// Проверка входных данных
		if (!user_id) { throw new Error('Ошибка данных: user_id не указан.') }
		// Подключаемся к базе
		await connectToDatabase();
		// Определяем фильтр по промоакциям
		const promotionFilter = onlyActive ? { status: "active" } : {};
		const promotions = await getPromotions(promotionFilter);
		// Проверяем данные
		if (!promotions || promotions.length === 0) {
			return {
				success: true,
				message: onlyActive
					? 'Нет активных раздач для удаления участия'
					: 'Нет раздач вообще',
				deleted: 0
			};
		}
		// Получаем массив ID промоакций
		const promotionIds = promotions.map(p => p._id || p.id);
		// Удаляем все записи участника в этих промоакциях
		const result = await Participant.deleteMany({
			user_id: user_id,
			promotion_id: { $in: promotionIds }
		});
		return result;
	} catch (error) {
		logger.error('Ошибка удаления участий:', error);
	}
}

export async function setParticipants(promotion_id, users) {
	try {
		// Проверка входных данных
		if (!promotion_id) { throw new Error('Ошибка данных: promotion_id не указан.') }
		if (!users || !Array.isArray(users) || users.length === 0) { throw new Error('Ошибка данных: users должен быть непустым массивом.') }
		// Подключаемся к базе
		await connectToDatabase();
		// Подготовка данных для массового создания
		const participantsData = users.map(user_id => ({
			promotion_id: promotion_id,
			user_id: user_id,
			status: 'pending',
			participation_date: new Date()
		}));
		
		// Используем insertMany с ordered: false — чтобы продолжить при дубликатах
		const result = await Participant.insertMany(participantsData, {
			ordered: false,
			rawResult: true 
		});

		return result.insertedCount || result.nInserted || 0;
	} catch (e) {
		logger.error('Ошибка добавления участий:', e);
	}
};