// Импорты
import userProfileMessage from "#messages/user/userProfileMessage.js";
import userProfileKeyboards from "#keyboards/user/userProfileKeyboards.js";

// Логирование
import logger from "#utils/logs.js"

// Меню профиля
export default (telegram) => {
	try{
		telegram.action("user_profile", async (ctx) => {
			return await ctx.editMessageText(await userProfileMessage(ctx), {
				reply_markup: userProfileKeyboards.reply_markup,
				parse_mode: "HTML",
			});
		});
	} catch (e){
		logger.error('Ошибка (user_profile)', e)
	}
};