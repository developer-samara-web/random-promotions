// Инициализация платежа
export async function initPayment(user, tariff, transaction) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/init`, {
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify({ user, tariff, transaction })
        });

        return await response.json();
    } catch (e) {
        console.error('Ошибка получения данных инициализации платежа:', e);
    }
}