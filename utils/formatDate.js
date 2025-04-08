// Форматирование даты
export default function formatDate(date) {
    // Проверяем полученные данные
    if (!(date instanceof Date) || isNaN(date)) { return 'Некорректная дата' }

    // Добавляем 3 часа (UTC+3)
    const correctedDate = new Date(date);
    correctedDate.setHours(correctedDate.getHours() + 3);
    
    // Собираем дату и время
    const day = String(correctedDate.getDate()).padStart(2, '0');
    const month = String(correctedDate.getMonth() + 1).padStart(2, '0');
    const year = correctedDate.getFullYear();
    
    // Возвращаем отформатированную дату
    return `${day}.${month}.${year}`;
}