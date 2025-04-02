import { NextResponse } from 'next/server';
import connectToDatabase from '@/services/mongodb';
import Participant from '@/models/Participant';
import Promotion from '@/models/Promotion';

// Получаем список Участий пользователя
export async function GET(request, ctx) {
    try {
        // Получаем id акции
        const { user_id } = await ctx?.params;
        // Проверяем id акции
        if (user_id === 'undefined') { return NextResponse.json({ status: 404, error: 'Ошибка при загрузке участий.' }) }
        // Подключаемся к базе данных
        await connectToDatabase();
        // Получаем участия
        const participant = await Participant.find({ user_id }).populate(
            { path: 'promotion_id', model: 'Promotion' },
        );
        // Если участий не существует
        if (!participant) { return NextResponse.json({ status: 404, error: 'Участий не найдено. Попробуйте повторить попытку позже или обратитесь в службу поддержки.' }) }
        // Отправляем данные
        return NextResponse.json({ status: 200, response: participant })
    } catch (error) {
        console.error('Ошибка при получении акции:', error);
        return NextResponse.json({ status: 500, error: 'Что-то пошло не так. Попробуйте повторить попытку позже или обратитесь в поддержку.' })
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