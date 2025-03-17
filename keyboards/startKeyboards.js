// Импорт
import { Markup } from "telegraf";

// Стартовое меню пользователей
export default Markup.inlineKeyboard([
	[Markup.button.callback("👤 Мой Профиль", "user_profile")],
	[Markup.button.callback("🔥2 дня за 1 рубль🔥", "user_premium_1")],
	[Markup.button.callback("⭐️ Премиум подписка ⭐️", "user_premium")]
]);