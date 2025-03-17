// Импорты
import { Telegraf } from "telegraf";
import logger from "#utils/logs.js";

// Проверка на токен
if (!process.env.TELEGRAM_TOKEN) {
	logger.error("Не указан TELEGRAM_TOKEN в .env");
	process.exit(1);
}

// Получаем объект бота
let telegram;
try {
	telegram = new Telegraf(process.env.TELEGRAM_TOKEN);
	logger.info("Бот успешно запустился.");
} catch (error) {
	logger.error("Ошибка при запуске бота:", error);
	process.exit(1);
}

export default telegram;