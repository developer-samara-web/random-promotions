// Логирование
import logger from "#utils/logs.js";

// Контроллер "Получение данных подписки"
export async function getSubscribe(id) {
    try {
        // Проверка входных данных
        if (!id) { throw new Error('Ошибка данных, id не заполнен.') }

        // Данные для авторизации
        const publicId = process.env.CLOUDPAYMENTS_PUBLIC_ID;
        const apiSecret = process.env.CLOUDPAYMENTS_PUBLIC_SECRET;
        const base64Auth = btoa(`${publicId}:${apiSecret}`);

        // Обновляем данные подписки
        const subscribe = await fetch(`https://api.cloudpayments.ru/subscriptions/get`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${base64Auth}`
            },
            body: JSON.stringify({ Id: id }),
        });

        // Отправляем данные
        return subscribe.json();
    } catch (e) {
        logger.error('Ошибка получения участий:', e);
    }
};