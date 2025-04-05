// Импорты
import { NextResponse } from 'next/server';
import connectToDatabase from '@/services/mongodb';
import User from '@/models/User';

// Маршрут "Получение данных пользователя"
export async function GET(request, ctx) {
    try {
        // Получаем id пользователя
        const { id } = await ctx?.params;
        // Проверяем данные пользователя
        if (id === 'undefined') { return NextResponse.json({ error: 'Ошибка при загрузке пользователя. Если проблема повторяется, пожалуйста, свяжитесь с нашей технической поддержкой для уточнения причин.' }, { status: 404 }) };
        // Подключаемся к базе данных
        await connectToDatabase();
        // Получаем пользователя
        const user = await User.findOne({ telegram_id: id });
        // Если пользователя не существует
        if (!user) { return NextResponse.json({ error: 'Пользователь не найден. Попробуйте повторить попытку позже или обратитесь в службу поддержки.' }, { status: 404 }) };
        // Отправляем данные
        return NextResponse.json({ response: user }, { status: 200 });
    } catch (e) {
        console.error('Ошибка при получении данных пользователя:', e);
        return NextResponse.json({ error: 'Что-то пошло не так. Попробуйте повторить попытку позже или обратитесь в поддержку.' }, { status: 500 });
    }
}

// Маршрут "Обновление данных пользователя"
export async function PUT(request, ctx) {
    try {
        // Получаем id пользователя
        const { id } = await ctx?.params;
        // Получение данных
        const body = await request.json();
        // Проверяем данные пользователя
        if (id === 'undefined') { return NextResponse.json({ error: 'Ошибка при загрузке пользователя. Если проблема повторяется, пожалуйста, свяжитесь с нашей технической поддержкой для уточнения причин.' }, { status: 404 }) };
        // Подключаемся к базе данных
        await connectToDatabase();
        // Получаем пользователя и обновляем
        const user = await User.findOneAndUpdate({ _id: id }, { $set: body }, { new: true });
        // Если пользователя не существует
        if (!user) { return NextResponse.json({ error: 'Пользователь не найден. Попробуйте повторить попытку позже или обратитесь в службу поддержки.' }, { status: 404 }) };
        // Отправляем данные
        return NextResponse.json({ response: user }, { status: 200 });
    } catch (e) {
        console.error('Ошибка при обновлении данных пользователя:', e);
        return NextResponse.json({ error: 'Что-то пошло не так. Попробуйте повторить попытку позже или обратитесь в поддержку.' }, { status: 500 });
    }
}

// Настройка методов и заголовков
export async function OPTIONS() {
    return NextResponse.json(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_URL || '*',
            'Access-Control-Allow-Methods': 'GET, PUT',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Max-Age': '3600',
        },
    });
}