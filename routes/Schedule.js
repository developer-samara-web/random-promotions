// Импорты
import { addSchedule } from "#services/Schedule.js";
import { setSchedule } from "#controllers/Schedule.js";
import { getPromotion } from "#controllers/Promotion.js";

// Логирование
import logger from "#utils/logs.js";

// Маршруты расписания
export default async function (app, telegram) {
    // Создание расписания раздачи
    app.post('/schedule/promotions/create', async (req, res) => {
        try {
            // Получаем id раздачи
            const { promotion_id } = req.body;
            // Получаем время раздачи
            const { start_date, end_date } = await getPromotion(promotion_id);
            // Создаём новую задачу в базе
            const schedule = await setSchedule({ type: 'promotion', promotion_id, start_date, end_date });
            // Отправляем в планеровщик
            await addSchedule(schedule, telegram);
            // Логирование
            logger.info(`Задача создана: ID:${promotion_id}`);
            return res.status(200).json({ status: 'success' });
        } catch (e) {
            return res.status(403).send(`Ошибка доступа.`);
        }
    });
}