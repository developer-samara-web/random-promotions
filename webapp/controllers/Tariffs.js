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

// Получение всех тарифов
export async function getTariffs() {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tariffs`, {
            headers: { 'Content-Type': 'application/json' },
            method: 'GET'
        });

        return response.json();
    } catch (e) {
        console.error('Ошибка при получении тарифов:', e);
    }
}

// Создание тарифа
export async function setTariff(data) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tariffs`, {
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify(data),
        });

        return response.json();
    } catch (e) {
        console.error('Ошибка при создании тарифа:', e);
    }
}