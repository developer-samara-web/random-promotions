import { NextResponse } from 'next/server';
import connectToDatabase from '@/services/mongodb';
import Promotion from '@/models/Promotion';

// Получаем всех акций
export async function GET(request, params) {
    try {
        // Получаем id акции
        const { id } = await ctx?.params;
        // Подключаемся к базе данных
        await connectToDatabase();
        // Получаем акцию
        const promotions = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/schedule/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ promotion_id: id }),
        });
        // Если акции не существует
        if (!promotions) { return NextResponse.json({ status: 404, error: 'Акции не найдены.' }) }
        // Отправляем данные
        return NextResponse.json({ status: 200, response: promotions })
    } catch (error) {
        console.error('Ошибка при получении акций:', error);
        return NextResponse.json({ status: 500, error: 'Что-то пошло не так. Попробуйте повторить попытку позже или обратитесь в поддержку.' })
    }
}