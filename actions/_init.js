// Импорты
import { profileAction } from "#actions/User.js";
import { startAction, rulesAction, deleteAction } from "#actions/Main.js";
import { adminAction } from "#actions/Admin.js";

// Логирование
import logger from "#utils/logs.js";

// Список экшенов
export default (Telegram) => {
	try {
		// Главное меню
		startAction(Telegram);
		// Меню правил
		rulesAction(Telegram);
		// Удаление сообщений
		deleteAction(Telegram);
		// Меню профиля
		profileAction(Telegram);
		// Меню администратора
		adminAction(Telegram);
	} catch (e) {
		logger.error("Ошибка инициализации экшенов:", e)
	}
};