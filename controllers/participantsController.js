// Импорты
import connectToDatabase from "#services/mongodb.js";
import Participant from "#models/Participant.js";
import User from "#models/User.js";

// Логирование
import logger from "#utils/logs.js";

// Получение всех участий в акции
export async function getParticipants(promotion_id) {
    try {
        // Проверка входных данных
        if (!promotion_id) { throw new Error('Ошибка данных, id не заполнен.') }
        // Подключаемся к базе
        await connectToDatabase();
        // Получаем акцию
        const participants = await Participant.countDocuments({ promotion_id: promotion_id });
        // Проверяем данные
        if (!participants) { return null };
        // Отправляем данные
        return participants;
    } catch (e) {
        logger.error('Ошибка получения участий:', e);
    }
};

export async function getParticipantsWinners(body) {
    try {
        // Проверка входных данных
        if (!body) { throw new Error('Ошибка данных, id не заполнен.') }
        // Подключаемся к базе
        await connectToDatabase();
        // Получаем акцию
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