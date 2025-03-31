import { NextResponse } from 'next/server';
import connectToDatabase from '@/services/mongodb';
import Participant from '@/models/Participant';

// Создание Участия
export async function POST(request) {
    try {
        // Подключаемся к базе данных
        await connectToDatabase();
        // Получение данных
        const query = await request.json();
        // Получаем список
        const participant = new Participant({ ...query });
        // Если приглашений нет
        if (!participant) { return NextResponse.json({ status: 404, error: 'Не удалось создать участие.' }) }
        // Сохраняем
        await participant.save();
        // Обновляем счётчик участий
        await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/participants/update`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ promotion_id: participant.promotion_id }),
        });
        // Отправляем данные
        return NextResponse.json({ response: participant }, { status: 200 });
    } catch (error) {
        console.error('Ошибка при создании акции:', error)
        return NextResponse.json(
            { status: 500, error: 'Что-то пошло не так. Попробуйте позже или обратитесь в поддержку.' },
            { status: 500 }
        );
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
    })
}