// Импорты
import connectToDatabase from "#services/mongodb.js";
import User from "#models/User.js";

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