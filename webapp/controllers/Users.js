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

// Регистрация пользователя
export async function setUser(data) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify({ data })
        });

        return response.json();
    } catch (e) {
        console.error('Ошибка при создании пользователя:', e);
    }
}

// Обновляем данные пользователя
export async function updateUser(id, data) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/${id}`, {
            headers: { 'Content-Type': 'application/json' },
            method: 'PUT',
            body: JSON.stringify({ data })
        });

        return response.json();
    } catch (e) {
        console.error('Ошибка при создании пользователя:', e);
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