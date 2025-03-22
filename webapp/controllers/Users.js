// Получение пользователя
export async function checkAdmin() {
    try{
        const response =  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/check-admin`, {
            headers: { 'Content-Type': 'application/json' },
            method: 'GET'
        });

        return response.json();
    } catch (e){
        console.error('Ошибка при проверке пользователя:', e);
    }
}