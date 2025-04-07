// Импорты
import { NextResponse } from 'next/server';
import connectToDatabase from '@/services/mongodb';
import User from '@/models/User';

// Маршрут "Создание пользователя"
export async function POST(request) {
    try {
        // Подключаемся к базе данных
        await connectToDatabase();
        // Получение данных
        const query = await request.json();
        // Проверяем подписку
        const subscribe = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/user/subscribe`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ telegram_id: query.data.id }),
        });
        // Смотрим статус пользоваеля
        const isSubscribed = ["member", "administrator", "creator"].includes(subscribe.status);
        // Создаём пользователя
        const user = new User({
            telegram_id: query.data.id,
            username: query.data.username,
            first_name: query.data.first_name,
            channel_subscription: isSubscribed ? true : false,
        });
        // Если приглашений нет
        if (!user) { return NextResponse.json({ error: 'Не удалось зарегистрировать пользователя.' }, { status: 404 }) };
        // Сохраняем пользователя
        await user.save();
        // Отправляем данные
        return NextResponse.json({ status: 200, response: user }, { status: 200 });
    } catch (e) {
        console.error('Ошибка при создании пользователя:', e);
        return NextResponse.json({ status: 500, error: 'Что-то пошло не так. Попробуйте позже или обратитесь в поддержку.' }, { status: 500 });
    }
}

// Настройка методов и заголовков
export async function OPTIONS() {
    return NextResponse.json(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_URL || '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Max-Age': '3600',
        },
    });
}