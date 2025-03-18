// Импорты
import "dotenv/config";
import Auth from "#controllers/authController.js"
import Actions from "#actions/_init.js";
import telegram from "#services/telegram.js";
import { startMessage } from "#messages/mainMessages.js";
import { startKeyboard } from "#keyboards/mainKeyboards.js"

// Инициализация экшенов
Actions(telegram);

// Авторизация
telegram.use(Auth)

// Отправляем стартовое сообщение
telegram.start(async (ctx) => {
	await ctx.replyWithHTML(startMessage(ctx), startKeyboard());
});

// Запуск бота
telegram.launch();