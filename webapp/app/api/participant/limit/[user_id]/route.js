import { NextResponse } from 'next/server';
import connectToDatabase from '@/services/mongodb';
import Participant from '@/models/Participant';
import User from '@/models/User';

// Проверка лимита участий
export async function GET(request, ctx) {
    try {
        // Получаем id акции
        const { user_id } = await ctx?.params;

        // Подключаемся к базе
        await connectToDatabase();

        // Получаем пользователя
        const { stats, subscription } = await User.findById(user_id);

        // Берём даты за последний месяц
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        // Получаем данные
        const participations = await Participant.countDocuments({
            user_id,
            participation_date: {
                $gte: firstDayOfMonth,
                $lte: lastDayOfMonth
            }
        });

        // Проверяем полученые данные
        if (!subscription.is_active && participations >= stats.free_participations) {
            return NextResponse.json({ access: false });
        }

        return NextResponse.json({ access: true });
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
            'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_URL,
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Max-Age': '3600',
        },
    })
}