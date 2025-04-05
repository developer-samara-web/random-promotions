// Создание транзакции
export async function setTransaction(data) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transaction`, {
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify(data)
        });

        return response.json();
    } catch (e) {
        console.error('Ошибка при создании транзакции:', e);
    }
}

// Контроллер "Получение данных о транзакциях пользователя"
export async function getTransactions(id) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transaction/${id}`, {
            headers: { 'Content-Type': 'application/json' },
            method: 'GET'
        });

        return response.json();
    } catch (e) {
        console.error('Ошибка при получении транзакций пользователя:', e);
    }
}