// Импорты
import ScheduleRoutes from "#routes/Schedule.js";
import ParticipantsRoutes from "#routes/Participants.js";
import SubscribeRoutes from "#routes/Subscribe.js";

// Логирование
import logger from "#utils/logs.js";

// Инициализация маршрутов
export default async function (app, telegram) {
    try {
        // Маршруты задач
        await ScheduleRoutes(app, telegram);
        // Маршруты участников
        await ParticipantsRoutes(app, telegram);
        // Маршруты подписок
        await SubscribeRoutes(app, telegram);
    } catch (e) {
        logger.error('Ошибка инициализации маршрутов:', e)
    }
}