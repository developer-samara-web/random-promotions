// Сообщение "Панель администратора"
export function adminMessage(users, participants, promotions) {
    return (`<b>🛠️ Панель администратора</b>\n\n🔹 <b>Пользователей:</b> ${users}\n🔹 <b>Раздач:</b> ${promotions}\n🔹 <b>Участий:</b> ${participants}`);
}