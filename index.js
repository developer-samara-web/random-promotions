// Импорты
import "dotenv/config";
import { initScheduler } from "#services/schedule.js";
import { initServerApi } from "#services/express.js";
import Auth from "#controllers/authController.js"
import Telegram from "#services/telegram.js";
import Actions from "#actions/_init.js";

// Запускаем api сервер
initServerApi(Telegram)
// Инициализация экшенов
Actions(Telegram);
// Инициализация планировщика
initScheduler(Telegram);
// Авторизация
Telegram.use(Auth);
// Запуск бота
Telegram.launch();