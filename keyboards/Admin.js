// Импорт
import { Markup } from "telegraf";

// Клавиатура "Панель администратора"
export function adminKeyboard(user) {
	return Markup.inlineKeyboard([
		...(user.is_admin ? [
			[
				Markup.button.webApp("📝  Новая раздача", `${process.env.TELEGRAM_WEBAPP}/promotions/create`),
				Markup.button.webApp("⚙️  Управление раздачами", `${process.env.TELEGRAM_WEBAPP}/promotions`)
			]
		] : []),
		[Markup.button.callback("🚀 Главное меню", "start_menu")]
	]);
}