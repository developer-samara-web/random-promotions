// Импорты
import { NextResponse } from "next/server";

// Маршрут "Получение данных о подписке"
export async function GET(request) {
    try {
        // Получение данных
        const { id } = await request.json();
        // Данные для авторизации
        const publicId = process.env.CLOUDPAYMENTS_PUBLICK_ID;
        const apiSecret = process.env.CLOUDPAYMENTS_PUBLICK_SECRET;
        const base64Auth = btoa(`${publicId}:${apiSecret}`);
        // Создаём задачу в боте
        await fetch(`https://api.cloudpayments.ru/subscriptions/get`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${base64Auth}`
            },
            body: JSON.stringify({ id: id }),
        });
        // Отправляем данные
        return NextResponse.json({ response: promotion }, { status: 200 });
    } catch (e) {
        console.error('Ошибка при получении данных о подписке:', e);
        return NextResponse.json({ error: 'Что-то пошло не так. Попробуйте позже или обратитесь в поддержку.' }, { status: 500 });
    }
}

// Настройка методов и заголовков
export async function OPTIONS() {
    return NextResponse.json(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_URL || '*',
            'Access-Control-Allow-Methods': 'GET, POST',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Max-Age': '3600',
        },
    });
}