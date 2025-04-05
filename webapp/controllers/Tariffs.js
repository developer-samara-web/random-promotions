// Получение данных тарифа
export async function getTariff(id) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tariffs/${id}`, {
            headers: { 'Content-Type': 'application/json' },
            method: 'GET'
        });

        return response.json();
    } catch (e) {
        console.error('Ошибка при получении тарифа:', e);
    }
}