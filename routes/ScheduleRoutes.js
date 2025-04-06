// Импорты
import { addSchedule } from "#services/schedule.js";
import { setSchedule } from "#controllers/scheduleController.js";
import { getPromotion } from "#controllers/promotionController.js";

// Логирование
import logger from "#utils/logs.js";

// Маршруты расписания
export default async function (app, telegram) {
    // Создание расписания акции
    app.post('/schedule/promotions/create', async (req, res) => {
        try {
            // Получаем id акции
            const { promotion_id } = req.body;
            // Получаем время акции
            const { start_date, end_date } = await getPromotion(promotion_id);
            // Создаём новую задачу в базе
            const schedule = await setSchedule({ type: 'promotion', promotion_id, start_date, end_date });
            // Отправляем в планеровщик
            await addSchedule(schedule, telegram);
            // Логирование
            logger.info(`Задача создана: ID:${promotion_id}`);
            return res.status(200).json({ status: 'success' });
        } catch (e) {
            console.log(e)
            return res.status(403).send(`Ошибка доступа.`);
        }
    });
}