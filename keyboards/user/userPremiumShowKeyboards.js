// Импорты
import { Markup } from "telegraf";

// Премиум меню / оплата
export default (price) => {
	try {
		return Markup.inlineKeyboard([
		  [Markup.button.callback(`💳 Клауд Пайментс | ${price} руб`, `user_premium_payment_${price}`)],
		  [Markup.button.callback("⬅️ Назад", "user_premium")],
		]);
	  } catch (error) {
		logger.error("Ошибка в userPremiumShowKeyboards:", error);
	  }
}