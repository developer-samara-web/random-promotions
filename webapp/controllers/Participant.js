// Контроллер "Получение участника"
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

// Контроллер "Регистрация участника"
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
        console.error('Ошибка при регистрации пользователя в раздачи:', e); ц
    }
}

// Контроллер "Получение всех участий пользователя"
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