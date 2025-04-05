// Импорты
import { NextResponse } from 'next/server';

// Маршрут "Получение статуса подписки пользователя"
export async function GET(request, ctx) {
    try {
        // Получаем id пользователя
        const { id } = await ctx?.params;
        // Проверяем id пользователя
        if (id === 'undefined') { return NextResponse.json({ error: 'Ошибка при получении данных подписки на канал. Если проблема повторяется, пожалуйста, свяжитесь с нашей технической поддержкой для уточнения причин.' }, { status: 404 }) };
        // Получаем статус подписки пользователя
        const user = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/user/subscribe`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ telegram_id: id }),
        });
        // Если подписки нет
        if (!user) { return NextResponse.json({ access: false }, { status: 401 }) };
        // Отправляем данные
        return NextResponse.json({ access: true }, { status: 200 });
    } catch (e) {
        console.error('Ошибка при получении акции:', e);
        return NextResponse.json({ error: 'Что-то пошло не так. Попробуйте повторить попытку позже или обратитесь в поддержку.' }, { status: 500 });
    }
}

// Настройка методов и заголовков
export async function OPTIONS() {
    return NextResponse.json(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_URL || '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Max-Age': '3600',
        },
    });
}