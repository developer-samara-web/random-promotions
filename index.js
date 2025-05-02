// Импорты
import "dotenv/config";
import { initSchedule } from "#services/Schedule.js";
import { initServer } from "#services/Express.js";
import Auth from "#controllers/Auth.js"
import Telegram from "#services/Telegram.js";
import Actions from "#actions/_init.js";
import Handlers from "#handlers/_init.js";

// Запускаем api сервер
initServer(Telegram)
// Инициализация планировщика
initSchedule(Telegram);
// Инициализация экшенов
Actions(Telegram);
// Инициализация обработчиков
Handlers(Telegram)
// Авторизация
Telegram.use(Auth);
// Запуск бота
Telegram.launch();