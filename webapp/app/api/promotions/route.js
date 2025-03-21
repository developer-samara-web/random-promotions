import { NextResponse } from 'next/server';
import connectToDatabase from '@/services/mongodb';
import Promotion from '@/models/Promotion';

// Создание акции
export async function POST(request) {
    try {
        // Подключаемся к базе данных
        await connectToDatabase();
        // Получение данных
        const query = await request.json();
        const lastPromotion = await Promotion.findOne().sort({ _id: -1 });
        const newId = lastPromotion ? lastPromotion._id + 1 : 1;
        // Получаем список
        const promotion = new Promotion({
            _id: newId,
            ...query
        });
        // Если приглашений нет
        if (!promotion) { return NextResponse.json({ status: 404, error: 'Не удалось создать акцию.' }) }
        // Сохраняем
        await promotion.save();
        // Отправляем данные
        return NextResponse.json({ status: 200, response: promotion }, { status: 200 });
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
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Max-Age': '3600',
        },
    })
}