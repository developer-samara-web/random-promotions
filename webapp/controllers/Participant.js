// Получение участия
export async function getParticipant(user, promotion) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/participant/${promotion}/${user}`, {
            headers: { 'Content-Type': 'application/json' },
            method: 'GET'
        });

        return response.json();
    } catch (e) {
        console.error('Ошибка получения данных участия:', e);
    }
}

// Получение всех участий
export async function getParticipants(user_id) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/participant/all/${user_id}`, {
            headers: { 'Content-Type': 'application/json' },
            method: 'GET'
        });

        return response.json();
    } catch (e) {
        console.error('Ошибка получения данных участий:', e);
    }
}

// Регистрация участия в акции
export async function setParticipant(promotion_id, user_id) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/participant`, {
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify({
                promotion_id,
                user_id
            })
        });

        return response.json();
    } catch (e) {
        console.error('Ошибка при регистрации пользователя в акции:', e); ц
    }
}

// Получение лимита участий
export async function getParticipantLimit(user_id) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/participant/limit/${user_id}`, {
            headers: { 'Content-Type': 'application/json' },
            method: 'GET'
        });

        return response.json();
    } catch (e) {
        console.error('Ошибка проверки лимита участий:', e);
    }
}