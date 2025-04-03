import { NextResponse } from 'next/server';
import connectToDatabase from '@/services/mongodb';
import User from '@/models/User';

// Создание пользователя
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
        // Создаём пользователя
        const user = new User({
            telegram_id: query.data.id,
            username: query.data.username,
            first_name: query.data.first_name,
            channel_subscription: subscribe.status ? true : false,
        });
        // Если приглашений нет
        if (!user) { return NextResponse.json({ status: 404, error: 'Не удалось зарегистрировать пользователя.' }) }
        // Сохраняем
        await user.save();
        // Отправляем данные
        return NextResponse.json({ status: 200, response: user }, { status: 200 });
    } catch (error) {
        console.error('Ошибка при создании пользователя:', error)
        return NextResponse.json(
            { status: 500, error: 'Что-то пошло не так. Попробуйте позже или обратитесь в поддержку.' },
            { status: 500 }
        );
    }
}