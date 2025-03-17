// Импорты
import { Markup } from "telegraf";

// Премиум меню
export default Markup.inlineKeyboard([
	[Markup.button.callback("🔥 2 дня за 1 рубль 🔥", "user_premium_1")],
	[Markup.button.callback("❤️‍🔥 Недельная | 150 рублей", "user_premium_150")],
	[Markup.button.callback("❤️‍🔥 Месячная | 500 рублей", "user_premium_500")],
	[Markup.button.callback("⬅️ Назад", "start_menu")],
]);