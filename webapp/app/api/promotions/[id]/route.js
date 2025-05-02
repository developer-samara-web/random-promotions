// Импорты
import { NextResponse } from "next/server";
import connectToDatabase from "@/services/mongodb";
import Promotion from "@/models/Promotion";

// Маршрут "Получение акций"
export async function GET(request, ctx) {
    try {
        // Получаем id раздачи
        const { id } = await ctx?.params;
        // Подключаемся к базе данных
        await connectToDatabase();
        // Получаем раздачу
        const promotion = await Promotion.findById(id);
        // Если раздачи не существует
        if (!promotion) { return NextResponse.json({ error: 'Раздача не найдена. Попробуйте повторить попытку позже или обратитесь в службу поддержки.' }, { status: 404 }) };
        // Отправляем данные
        return NextResponse.json({ response: promotion }, { status: 200 });
    } catch (e) {
        console.error('Ошибка при получении раздачи:', e);
        return NextResponse.json({ error: 'Что-то пошло не так. Попробуйте повторить попытку позже или обратитесь в поддержку.' }, { status: 500 });
    }
}

// Маршрут "Редактирование раздачи"
export async function PUT(request, ctx) {
    try {
        // Получаем id раздачи
        const { id } = await ctx?.params;
        // Подключаемся к базе данных
        await connectToDatabase();
        // Получение данные
        const query = await request.json();
        // Получаем раздачу и обновляем
        const promotion = await Promotion.findByIdAndUpdate(id, query, { new: true });
        // Если ошибка обновления
        if (!promotion) { return NextResponse.json({ error: 'Не удалось отредактировать раздачу.' }, { tatus: 404 }) };
        // Отправляем данные
        return NextResponse.json({ response: promotion }, { status: 200 });
    } catch (e) {
        console.error('Ошибка при создании раздачи:', e);
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