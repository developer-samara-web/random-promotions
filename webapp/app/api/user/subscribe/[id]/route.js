// Импорт компонентов
import { NextResponse } from 'next/server';
import connectToDatabase from '@/services/mongodb';
import User from '@/models/User';

// Получаем данные пользователя
export async function GET(request, ctx) {
    try {
        // Получаем id пользователя
        const { id } = await ctx?.params;
        // Проверяем id пользователя
        if (id === 'undefined') { return NextResponse.json({ status: 404, error: 'Ошибка при получении данных подписки на канал. Если проблема повторяется, пожалуйста, свяжитесь с нашей технической поддержкой для уточнения причин.' }) }
        // Подключаемся к базе данных
        await connectToDatabase();
        // Получаем подписку пользователя
        const user = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/user/subscribe`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ telegram_id: id }),
        });
        // Если подписки нет
        if (!user) { return NextResponse.json({ access: false }) }
        // Отправляем данные
        return NextResponse.json({ access: true })
    } catch (error) {
        console.error('Ошибка при получении акции:', error);
        return NextResponse.json({ status: 500, error: 'Что-то пошло не так. Попробуйте повторить попытку позже или обратитесь в поддержку.' })
    }
}