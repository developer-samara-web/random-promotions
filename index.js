// Импорты
import "dotenv/config";
import { initSchedule } from "#services/schedule.js";
import { initServer } from "#services/express.js";
import Auth from "#controllers/authController.js"
import Telegram from "#services/telegram.js";
import Actions from "#actions/_init.js";

// Запускаем api сервер
initServer(Telegram)
// Инициализация планировщика
initSchedule(Telegram);
// Инициализация экшенов
Actions(Telegram);
// Авторизация
Telegram.use(Auth);
// Запуск бота
Telegram.launch();