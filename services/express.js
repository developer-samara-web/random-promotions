// Импорт компонентов
import express from "express";
import { addSchedule } from "#services/schedule.js";
import { setSchedule } from "#controllers/scheduleController.js";
import { getPromotion } from "#controllers/promotionController.js";
import { updatePost } from "#controllers/telegramController.js";
import { getParticipants } from "#controllers/participantsController.js";

// Логирование
import logger from "#utils/logs.js";

// Инициализируем api сервер
export async function initServerApi(telegram) {
    try {
        // Проверка порта
        if (!process.env.EXPRESS_PORT) {
            logger.error('Ошибка запуска api сервера: порт не указан.')
            return;
        }
        // Создаём сервер
        const app = express();
        app.use(express.json());

        // Запускаем сервер
        app.listen(process.env.EXPRESS_PORT, () => {
            logger.info(`Сервер запущен: PORT:${process.env.EXPRESS_PORT}`)
        });

        // Создание расписания
        app.post('/schedule/create', async (req, res) => {
            try {
                // Получаем id акции
                const { promotion_id } = req.body;
                // Получаем время акции
                const { start_date, end_date } = await getPromotion(promotion_id);
                // Создаём новую задачу в базе
                const schedule = await setSchedule({ promotion_id, start_date, end_date });
                // Отправляем в планеровщик
                const newJob = addSchedule(schedule, telegram);
                // Логирование
                logger.info(`Задача создана: ${newJob}`)
                res.status(200).send(`Задача создана.`);
            } catch (e) {
                res.status(403).send(`Ошибка дотупа.`);
            }
        });

        // Обновление счётчика участия
        app.post('/participants/update', async (req, res) => {
            try {
                // Получаем id акции
                const { promotion_id } = req.body;
                // Получаем время акции
                const promotion = await getPromotion(promotion_id);
                const participants = await getParticipants(promotion_id);
                await updatePost(telegram, promotion, participants);
            } catch (e) {
                res.status(403).send(`Ошибка дотупа.`);
            }
        });

    } catch (e) {
        logger.error('Ошибка запуска api сервера:', e)
    }
}