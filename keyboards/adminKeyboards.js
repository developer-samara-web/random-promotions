// Импорт
import { Markup } from "telegraf";

// Клавиатура "Панель администратора"
export function adminKeyboard() {
    return Markup.inlineKeyboard([
        [Markup.button.webApp("🛠️ Создать акцию", `${process.env.TELEGRAM_WEBAPP}/promotions/create`)],
        [Markup.button.webApp("📝 Управление акциями", `${process.env.TELEGRAM_WEBAPP}/promotions`)],
        [Markup.button.webApp("🔥 Настройка тарифов", `${process.env.TELEGRAM_WEBAPP}/tariffs`)]
    ]);
}