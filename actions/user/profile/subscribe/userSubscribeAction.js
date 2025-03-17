// Импорты
import userSubscribeMessage from "#messages/user/userSubscribeMessage.js";
import userSubscribeKeyboards from "#keyboards/user/userSubscribeKeyboards.js";

// Логирование
import logger from "#utils/logs.js"

// Меню настройки подписки
export default (telegram) => {
	try{
		telegram.action("user_subscribe", async (ctx) => {
			return await ctx.editMessageText(await userSubscribeMessage(ctx), {
				reply_markup: userSubscribeKeyboards.reply_markup,
				parse_mode: "HTML",
			});
		});
	} catch (e){
		logger.error('Ошибка (user_subscribe)', e)
	}
};