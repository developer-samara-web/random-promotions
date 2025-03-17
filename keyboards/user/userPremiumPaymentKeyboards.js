// Импорты
import { Markup } from "telegraf";

// Премиум меню / удачная оплата
export default Markup.inlineKeyboard([
	[Markup.button.callback("👤 Профиль", "user_profile")],
	[Markup.button.callback("⬅️ Главное меню", "start_menu")],
]);