// Импорты
import connectToDatabase from "#services/mongodb.js";
import Promotion from "#models/Promotion.js";
import logger from "#utils/logs.js";

// Получение акции
export async function getPromotion(id) {
	try {
		// Проверка входных данных
		if (!id) { throw new Error('Ошибка данных, id не заполнен.') }
		// Подключаемся к базе
		await connectToDatabase();
		// Получаем акцию
		const promotion = await Promotion.findById(id);
		// Проверяем данные
		if (!promotion) { return null };
		// Отправляем данные
		return promotion;
	} catch (e) {
		logger.error('Ошибка получения акции:', e);
	}
};

// Создание акции
export async function setPromotion(body) {
	try {
		// Проверка входных данных
		if (!body) { throw new Error('Ошибка данных: body не заполнен.') }
		// Подключаемся к базе
		await connectToDatabase();
		// Создаём новую акцию
		const promotion = new Promotion(body);
		// Сохраняем в базе
		await promotion.save();
		// Проверка данных
		if (!promotion) { return null };
		// Отправляем данные
		logger.info(`Новая акция: ${promotion._id}.`);
		return promotion;
	} catch (e) {
		logger.error('Ошибка создания акции:', e);
	}
};

// Обновление акции
export async function updatePromotion(id, body) {
	try {
		// Проверка входных данных
		if (!id || !body) { throw new Error('Ошибка данных: id не заполнен.') }
		// Подключаемся к базе
		await connectToDatabase();
		// Обновляем данные
		const promotion = await Promotion.findOneAndUpdate(
			{ _id: id },
			{ $set: body },
			{ new: true }
		);
		// Проверка данных
		if (!promotion) { return null };
		// Отправляем данные
		logger.info(`Акция обновлена: ${promotion._id}`);
		return promotion;
	} catch (e) {
		logger.error('Ошибка обновления акции:', e);
	}
};

// Отправка публикации
export async function publishPromotion(id, promotion, telegram) {
	try {
		const message = `🎉 Новая акция!\n\n${promotion.name}\n\n${promotion.description}`;

		await telegram.sendPhoto(id, promotion.image, {
			caption: message,
			parse_mode: 'HTML'
		});
	} catch (e) {
		logger.error('Ошибка получения акции:', e);
	}
};