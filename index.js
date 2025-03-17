// Импорты
import "dotenv/config";
import initActions from "#actions/initActions.js";
import startMessage from "#messages/startMessage.js";
import startKeyboard from "#keyboards/startKeyboards.js"
import telegram from "#services/telegram.js";

// Инициализация экшенов
initActions(telegram);

// Отправляем стартовое сообщение
telegram.start(async (ctx) => {
	await ctx.replyWithHTML( await startMessage(ctx), startKeyboard);
});

// Запуск бота
telegram.launch();