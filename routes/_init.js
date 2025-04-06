// Импорты
import ScheduleRoutes from "#routes/ScheduleRoutes.js";
import ParticipantsRoutes from "#routes/ParticipantsRoutes.js";
import SubscribeRoutes from "#routes/SubscribeRoutes.js";
import notificationRoutes from "#routes/notificationRoutes.js";

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
        // Маршруты уведомлений
        await notificationRoutes(app, telegram)
    } catch (e) {
        logger.error('Ошибка инициализации маршрутов:', e)
    }
}