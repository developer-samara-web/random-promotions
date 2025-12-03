// Импорт компонентов
import { NextResponse } from 'next/server';
import connectToDatabase from '@/services/mongodb';
import Participant from '@/models/Participant';

// Поиск участия
export async function GET(request, ctx) {
    try {
        // Получаем id раздачи
        const { promotion_id, user_id } = await ctx?.params;
        // Подключаемся к базе
        await connectToDatabase();
        // Получаем данные
        const participant = await Participant.findOne({
            promotion_id,
            user_id,
        });
        // Если участие есть
        if (!participant) { return NextResponse.json({ access: true }) }
        // Отправляем данные
        return NextResponse.json({ access: false })
    } catch (error) {
        console.error('Ошибка при получении раздачи:', error);
        return NextResponse.json({ status: 500, error: 'Что-то пошло не так. Попробуйте повторить попытку позже или обратитесь в поддержку.' })
    }
}

// Настройка методов и заголовков
export async function OPTIONS() {
    return NextResponse.json(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Max-Age': '3600',
        },
    })
}