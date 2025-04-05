// Контроллер "Получение данных о подписке"
export async function getSubscribe(id) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subscribes/${id}`, {
            headers: { 'Content-Type': 'application/json' },
            method: 'GET'
        });

        return response.json();
    } catch (e) {
        console.error('Ошибка получения данных подписки:', e);
    }
}