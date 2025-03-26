// Импорты
import "dotenv/config";
import Auth from "#controllers/authController.js"
import Actions from "#actions/_init.js";
import Telegram from "#services/telegram.js";
import { initScheduler } from "#services/schedule.js"

// Инициализация экшенов
Actions(Telegram);
initScheduler(Telegram);
// Авторизация
Telegram.use(Auth);
// Запуск бота
console.log('Текущее время:', new Date().toISOString());
Telegram.launch();