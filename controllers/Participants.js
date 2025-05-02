// Импорты
import connectToDatabase from "#services/Mongodb.js";
import Participant from "#models/Participant.js";
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