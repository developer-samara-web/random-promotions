// Импорт
import { Markup } from "telegraf";

// Клавиатура "Панель администратора"
export function adminKeyboard() {
    return Markup.inlineKeyboard([
        [Markup.button.callback("🛠️ Создать акцию", "admin_promotion_create")],
        [Markup.button.callback("📝 Редактировать акцию", "admin_promotion_edit")]
    ]);
}