import { Markup } from "telegraf";

// Меню подписки
export default Markup.inlineKeyboard([
	[Markup.button.callback("❌ Отменить подписку", "test")],
	[Markup.button.callback("⬅️ Назад", "user_profile")],
]);