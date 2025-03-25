// Получение пользователя
export async function getUser(id) {
    try{
        const response =  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/${id}`, {
            headers: { 'Content-Type': 'application/json' },
            method: 'GET'
        });

        return response.json();
    } catch (e){
        console.error('Ошибка при получении пользователя:', e);
    }
}

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

// Регистрация участия в акции
export async function setUserToPromotion(telegram_id, promotion_id, setSuccess, time) {
    try{
        const response =  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify({
                telegram_id: telegram_id,
                promotion_id: promotion_id
            })
        });

        setSuccess(`Вы успешно зарегистрированы в розыгрыше!\nДата розыгрыша: ${time}\nСледите за результатами в нашем канале:https://t.me/mr_razdachkin \nУдачи! 🍀`)

        return response.json();
    } catch (e){
        console.error('Ошибка при регистрации пользователя в акции:', e);ц
    }
}