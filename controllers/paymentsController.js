// Логирование
import logger from "#utils/logs.js";
import querystring from 'querystring';

// Контроллер "Обновление подписки"
export async function updatePayment(id, body) {
    try {
        // Проверка входных данных
        if (!id || !body) { throw new Error('Ошибка данных, id или body не заполнен.') }

        // Данные для авторизации
        const publicId = process.env.CLOUDPAYMENTS_PUBLIC_ID;
        const apiSecret = process.env.CLOUDPAYMENTS_PUBLIC_SECRET;
        const base64Auth = btoa(`${publicId}:${apiSecret}`);

        // Обновляем данные подписки
        const subscribe = await fetch(`https://api.cloudpayments.ru/subscriptions/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${base64Auth}`
            },
            body: JSON.stringify({ Id: id, ...body }),
        });

        // Отправляем данные
        return subscribe;
    } catch (e) {
        logger.error('Ошибка обновления подписки:', e);
    }
};