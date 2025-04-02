// Получение пользователя
export async function getUser(id) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/${id}`, {
            headers: { 'Content-Type': 'application/json' },
            method: 'GET'
        });

        return response.json();
    } catch (e) {
        console.error('Ошибка при получении пользователя:', e);
    }
}

// Получение пользователя
export async function checkAdmin() {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/check-admin`, {
            headers: { 'Content-Type': 'application/json' },
            method: 'GET'
        });

        return response.json();
    } catch (e) {
        console.error('Ошибка при проверке пользователя:', e);
    }
}

export async function getSubscribe(id) {
    try {
        const response = fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/subscribe/${id}`, {
            headers: { 'Content-Type': 'application/json' },
            method: 'GET'
        });

        return response.json();
    } catch (e) {
        console.error('Ошибка при проверке подписки пользователя:', e);
    }
}