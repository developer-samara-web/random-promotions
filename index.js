// Импорты
import "dotenv/config";
import Auth from "#controllers/authController.js"
import Actions from "#actions/_init.js";
import Telegram from "#services/telegram.js";

// Инициализация экшенов
Actions(Telegram);
// Авторизация
Telegram.use(Auth);
// Запуск бота
Telegram.launch();