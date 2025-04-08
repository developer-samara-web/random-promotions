// Импорты
import { getUser } from "#controllers/userController.js";
import { startMessage, rulesMessage } from "#messages/mainMessages.js";
import { startKeyboard, rulesKeyboard } from "#keyboards/mainKeyboards.js";
import { adminMessage } from "#messages/adminMessages.js";
import { adminKeyboard } from "#keyboards/adminKeyboards.js";
import { getTariffs } from "#controllers/tariffController.js";

// Логирование
import logger from "#utils/logs.js";

// Контроллер "Авторизация / Регистрация"
export default async (ctx) => {
  // Проверка входных данных
  if (ctx.chat.type !== 'private') return;
  // Проверка на команду
  if (ctx.message?.text !== '/start') return;

  try {
    // Получаем данные о пользователе
    const { id } = ctx.from;
    // Проверяем пользователя
    const user = await getUser(id);
    // Проверяем сушествование пользователя
    if (!user) {
      // Отправляем первое сообщение с правилами
      await ctx.replyWithHTML(rulesMessage(), { disable_web_page_preview: true, ...rulesKeyboard() });
    } else {
      // Если администратор
      if (user.role === "admin") { return await ctx.replyWithHTML(adminMessage(ctx), adminKeyboard()) }
      // Получаем тарифы
      const tariffs = await getTariffs();
      const promoTarifs = tariffs.find((tariff) => tariff.main_menu)
      // Если пользователь
      return await ctx.replyWithHTML(startMessage(ctx), startKeyboard(user.subscription, promoTarifs));
    }
  } catch (e) {
    logger.error('Ошибка регистрации пользователя:', e);
  }
};