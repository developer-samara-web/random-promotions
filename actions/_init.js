// Импорты
import { startAction, rulesAction } from "#actions/Main.js";
import { profileAction } from "#actions/User.js";
import { supportAction } from "#actions/Support.js";
import { subscribeAction, subscribeShowAction, subscribeShowRulesAction } from "#actions/Subscribe.js";
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
    // Меню профиля
    profileAction(Telegram);
    // Меню техподдержки
    supportAction(Telegram);
    // Меню подписки
    subscribeAction(Telegram);
    // Меню правил подписки
    subscribeShowRulesAction(Telegram);
    // Меню оплаты подписки
    subscribeShowAction(Telegram);
    // Меню администратора
    adminAction(Telegram);
  } catch (e) {
    logger.error("Ошибка инициализации экшенов:", e)
  }
};