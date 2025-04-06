// Проверяем победы на текущий месяц
export default function checkWinners(premiumUsers) {
    // Если пользователи пусты
    if (!Array.isArray(premiumUsers) || premiumUsers.length === 0) { return null }
    // Подбираем даты
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    // Возвращаем данные
    return premiumUsers.filter(user => {
        // Если дата победы отсутствует (null) - пользователь подходит
        if (!user.stats?.last_win_date) { return true }

        // Парсим дату последней победы
        let lastWinDate;

        try {
            lastWinDate = new Date(user.stats.last_win_date);
        } catch (e) {
            return true;
        }

        // Проверяем, что последняя победа НЕ в текущем месяце и году
        return lastWinDate.getMonth() !== currentMonth || lastWinDate.getFullYear() !== currentYear;
    });
}