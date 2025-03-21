// Получение акции
export async function getPromotion(id) {
    try{
        const response =  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/promotions/${id}`, {
            headers: { 'Content-Type': 'application/json' },
            method: 'GET'
        });

        return response.json();
    } catch (e){
        console.error('Ошибка получения данных акции:', e);
    }
}

// Создание акции
export async function setPromotion(data) {
    try{
        return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/promotions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
    } catch (e) {
        console.error('Ошибка при создании акции:', e)
    }
}

// Обновление акции
export async function updatePromotion(data) {
    console.log(data)
    try{
        return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/promotions/${data._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
    } catch (e) {
        console.error('Ошибка обновления данных акции:', e)
    }
}