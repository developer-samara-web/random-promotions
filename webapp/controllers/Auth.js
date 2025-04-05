// Контроллер "Проверка авторизации"
export async function checkAuth(data) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth`, {
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify(data)
        });

        return response.json();
    } catch (e) {
        console.error('Ошибка при проверке авторизации пользователя:', e);
    }
}

// Контроллер "Проверка прав администратора"
export async function checkAdmin() {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/check-admin`, {
            headers: { 'Content-Type': 'application/json' },
            method: 'GET'
        });

        return response.json();
    } catch (e) {
        console.error('Ошибка при проверке прав администратора:', e);
    }
}