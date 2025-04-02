// Форматирование даты в нужном формате
export default function formatDate(isoString) {
    const date = new Date(isoString);

    // Основные настройки по умолчанию
    const defaultOptions = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    };

    // Объединяем с пользовательскими настройками
    const mergedOptions = { ...defaultOptions};

    // Форматируем дату
    const formattedDate = new Intl.DateTimeFormat('ru-RU', mergedOptions).format(date);

    return `${formattedDate}`;
}