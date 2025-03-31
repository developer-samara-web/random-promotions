// Получение рандомного пользователя
export default function randomUser(users, winnersCount = 1) {
    // Проверка на пустой массив или невалидные данные
    if (!Array.isArray(users) || users.length === 0 || winnersCount <= 0) {
        return [];
    }

    // Создаем копию массива, чтобы не мутировать исходный
    const usersCopy = [...users];
    const result = [];

    // Определяем максимально возможное количество победителей
    const maxWinners = Math.min(winnersCount, usersCopy.length);

    // Выбираем победителей
    for (let i = 0; i < maxWinners; i++) {
        // Генерируем случайный индекс
        const randomIndex = Math.floor(Math.random() * usersCopy.length);
        // Извлекаем пользователя по индексу
        const winner = usersCopy.splice(randomIndex, 1)[0];
        // Добавляем username в результат (если он существует)
        if (winner && winner.username) {
            result.push(winner);
        }
    }

    return result;
}