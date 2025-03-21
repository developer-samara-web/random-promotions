// Импорты
import { getUser } from "#controllers/userController.js";
import { startMessage, rulesMessage } from "#messages/mainMessages.js";
import { startKeyboard, rulesKeyboard } from "#keyboards/mainKeyboards.js";
import { adminMessage } from "#messages/adminMessages.js";
import { adminKeyboard } from "#keyboards/adminKeyboards.js";

// Логирование
import logger from "#utils/logs.js";

// Авторизация / Регистрация
export default async (ctx) => {
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
      if (user.is_admin) { return await ctx.replyWithHTML(adminMessage(ctx), adminKeyboard()) }
      // Если пользователь
      return await ctx.replyWithHTML(startMessage(ctx), startKeyboard());
    }
  } catch (e) {
    logger.error('Ошибка регистрации пользователя:', e);
  }
};