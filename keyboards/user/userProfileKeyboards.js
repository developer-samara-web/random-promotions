import { Markup } from "telegraf";

// Меню профиля
export default Markup.inlineKeyboard([
	[Markup.button.callback("⚙️ Управление подпиской", "user_subscribe")],
	[Markup.button.callback("⬅️ Назад", "start_menu")],
]);