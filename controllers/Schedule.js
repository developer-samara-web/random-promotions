// Импорты
import connectToDatabase from "#services/Mongodb.js";
import Schedule from "#models/Schedule.js";

// Логирование
import logger from "#utils/logs.js";

// Контроллер "Получаем все задачи"
export async function getSchedules() {
    try {
        // Подключаемся к базе
        await connectToDatabase();
        // Получаем пользователя
        const schedule = await Schedule.find({
            $or: [
                { status: 'scheduled' },
                { status: 'in_progress' }
            ]
        });
        // Проверяем данные
        if (!schedule) { return null };
        // Отправляем данные
        return schedule;
    } catch (e) {
        logger.error('Ошибка получения задач:', e);
    }
};

// Контроллер "Создание задачи"
export async function setSchedule(body) {
    try {
        // Проверка входных данных
        if (!body) { throw new Error('Ошибка данных, body не заполнены.') };
        // Подключаемся к базе
        await connectToDatabase();
        // Создаём новую задачу
        const schedule = new Schedule(body);
        // Сохраняем в базе
        await schedule.save();
        // Отправляем данные
        return schedule;
    } catch (e) {
        logger.error('Ошибка добавления задачи:', e);
    }
};

// Контроллер "Обновление задачи"
export async function updateSchedule(id, body) {
    try {
        // Проверка входных данных
        if (!id || !body) { throw new Error('Ошибка данных, id или body не заполнены.') };
        // Подключаемся к базе
        await connectToDatabase();
        // Обновляем данные
        const schedule = await Schedule.findOneAndUpdate(
            { _id: id },
            { $set: body },
            { new: true }
        );
        // Отправляем данные
        return schedule;
    } catch (e) {
        logger.error('Ошибка обновления задачи:', e);
    }
};

// Контроллер "Удаление задачи"
export async function delSchedule(id) {
    try {
        // Проверка входных данных
        if (!id) { throw new Error('Ошибка данных, id не заполнен.') };
        // Подключаемся к базе
        await connectToDatabase();
        // Удаляем задачу
        const schedule = await Schedule.findByIdAndDelete(id);
        // Отправляем данные
        return schedule;
    } catch (e) {
        logger.error('Ошибка удаления задачи:', e);
    }
};