// Форматирование даты
export default function formatDate(date) {
    // Проверяем полученные данные
    if (!(date instanceof Date) || isNaN(date)) { return 'Некорректная дата' }
    // Собираем дату и время
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    // Передаём данные
    return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
}