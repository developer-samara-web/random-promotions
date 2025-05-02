// Импорт
import { Markup } from "telegraf";

// Клавиатура "Панель администратора"
export function adminKeyboard(user) {
	return Markup.inlineKeyboard([
		...(user.role === 'admin' ? [[Markup.button.webApp("📝 Создать раздачу", `${process.env.TELEGRAM_WEBAPP}/promotions/create`)]] : []),
		...(user.role === 'admin' ? [[Markup.button.webApp("📁 Управление раздачами", `${process.env.TELEGRAM_WEBAPP}/promotions`)]] : []),
		...(user.role === 'admin' ? [[Markup.button.webApp("📝 Управление тарифами", `${process.env.TELEGRAM_WEBAPP}/tariffs`)]] : []),
		[Markup.button.callback("🚀 Главное меню", "start_menu")]
	]);
}