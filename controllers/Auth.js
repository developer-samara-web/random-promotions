// Импорты
import { getUser } from "#controllers/User.js";
import { startMessage, rulesMessage } from "#messages/Main.js";
import { startKeyboard, rulesKeyboard, MainMenuKeyboard } from "#keyboards/Main.js";
import { subscribeMessage, subscribeActiveSubscribeMessage } from "#messages/Subscribe.js";
import { subscribeKeyboard } from "#keyboards/Subscribe.js";
import { getTariffs } from "#controllers/Tariff.js";

// Логирование
import logger from "#utils/logs.js";

// Контроллер "Авторизация / Регистрация"
export default async (ctx) => {

  // Проверка входных данных
  if (ctx.chat.type !== 'private') return;

  // Открываем меню премиума
  if (ctx.message?.text === '/start premium') {
    const user = await getUser(ctx.from.id);
    const tariffs = await getTariffs();
    if (user.subscription.is_active) {
      return await ctx.replyWithHTML(subscribeActiveSubscribeMessage(), {
        reply_markup: MainMenuKeyboard().reply_markup,
        parse_mode: "HTML",
      });
    } else {
      return await ctx.replyWithHTML(subscribeMessage(ctx), {
        reply_markup: subscribeKeyboard(tariffs).reply_markup,
        parse_mode: "HTML",
      });
    }
  }

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
      // Если пользователь
      return await ctx.replyWithHTML(startMessage(ctx), { disable_web_page_preview: true, ...startKeyboard(user) });
  }
  } catch (e) {
  logger.error('Ошибка регистрации пользователя:', e);
}
};