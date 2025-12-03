// Импорт
import express from "express";
import bodyParser from "body-parser";
import initRoutes from "#routes/_init.js";

// Логирование
import logger from "#utils/logs.js";

// Сервис "ExpressJS"
export async function initServer (telegram) {
    try {
        // Проверка порта
        if (!process.env.EXPRESS_PORT) { throw new Error('Ошибка запуска сервера: укажите верный порт в .env.') }
        // Создаём сервер
        const app = express();
        // Формат данных
        app.use(express.json());
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json());
        // Инициализируем маршруты
        await initRoutes(app, telegram);
        // Запускаем сервер
        app.listen(process.env.EXPRESS_PORT, () => { logger.info(`Сервер запущен: PORT:${process.env.EXPRESS_PORT}`) });
    } catch (e) {
        logger.error('Ошибка запуска сервера:', e)
    }
}