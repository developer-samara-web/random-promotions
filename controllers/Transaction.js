// Импорты
import connectToDatabase from "#services/Mongodb.js";
import Transaction from "#models/Transaction.js";

// Логирование
import logger from "#utils/logs.js";

// Контроллер "Получение транзраздачи"
export async function getTransaction(id) {
    try {
        // Проверка входных данных
        if (!id) { throw new Error('Ошибка данных, id не заполнен.') };
        // Подключаемся к базе
        await connectToDatabase();
        // Получаем транзраздачу
        const transaction = await Transaction.find(id);
        // Проверяем данные
        if (!transaction) { return null };
        // Отправляем данные
        return transaction;
    } catch (e) {
        logger.error('Ошибка получения транзраздачи:', e);
    }
};

// Контроллер "Получение всех успешных транзакций пользователя"
export async function getTransactions(id) {
    try {
        // Проверка входных данных
        if (!id) { throw new Error('Ошибка данных, id не заполнен.') };
        // Подключаемся к базе
        await connectToDatabase();
        // Получаем транзраздачу
        const transactions = await Transaction.find({
            user_id: id,
            status: 'completed'
        });
        // Проверяем данные
        if (!transactions) { return null };
        // Отправляем данные
        return transactions;
    } catch (e) {
        logger.error('Ошибка получения транзакций:', e);
    }
};

// Контроллер "Обновление транзраздачи"
export async function updateTransaction(id, body) {
    try {
        // Проверка входных данных
        if (!id || !body) { throw new Error('Ошибка данных, id или body не заполнены.') };
        // Подключаемся к базе
        await connectToDatabase();
        // Обновляем данные
        const transaction = await Transaction.findOneAndUpdate(
            { _id: id },
            { $set: body },
            { new: true }
        );
        // Проверка данных
        if (!transaction) { return null };
        // Отправляем данные
        logger.info(`Транзакция обновлена: ID:${transaction._id}`);
        return transaction;
    } catch (e) {
        logger.error('Ошибка получения транзраздачи:', e);
    }
};

// Контроллер "Создание транзраздачи"
export async function setTransaction(body) {
    try {
        // Проверка входных данных
        if (!body) { throw new Error('Ошибка данных, body не заполнены.') };
        // Подключаемся к базе
        await connectToDatabase();
        // Создаём новую транзраздачу
		const transaction = new Transaction(body);
		// Сохраняем в базе
		await transaction.save();
		// Проверка данных
		if (!transaction) { return null };
		// Отправляем данные
		logger.info(`Транзакция создана: ID:${transaction._id}`);
		return transaction;
    } catch (e) {
        logger.error('Ошибка получения транзраздачи:', e);
    }
};