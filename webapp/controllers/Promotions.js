// Получение раздачи
export async function getPromotion(id) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/promotions/${id}`, {
            headers: { 'Content-Type': 'application/json' },
            method: 'GET'
        });

        return response.json();
    } catch (e) {
        console.error('Ошибка получения данных раздачи:', e);
    }
}

// Получение акций
export async function getPromotions() {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/promotions`, {
            headers: { 'Content-Type': 'application/json' },
            method: 'GET'
        });

        return response.json();
    } catch (e) {
        console.error('Ошибка получения данных раздачи:', e);
    }
}

// Создание раздачи
export async function setPromotion(data) {
    try {
        return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/promotions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
    } catch (e) {
        console.error('Ошибка при создании раздачи:', e)
    }
}

// Обновление раздачи
export async function updatePromotion(data) {
    try {
        return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/promotions/${data._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
    } catch (e) {
        console.error('Ошибка обновления данных раздачи:', e)
    }
}