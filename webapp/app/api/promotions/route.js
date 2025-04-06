// Импорты
import { NextResponse } from "next/server";
import connectToDatabase from "@/services/mongodb";
import Promotion from "@/models/Promotion";

// Маршрут "Получение акций"
export async function GET(request) {
    try {
        // Подключаемся к базе данных
        await connectToDatabase();
        // Получаем акции
        const promotions = await Promotion.find();
        // Если таблица акций пуста
        if (!promotions) { return NextResponse.json({ error: 'Акции не найдены.' }, { status: 404 }) };
        // Отправляем данные
        return NextResponse.json({ response: promotions }, { status: 200 });
    } catch (e) {
        console.error('Ошибка при получении акций:', e);
        return NextResponse.json({ error: 'Что-то пошло не так. Попробуйте повторить попытку позже или обратитесь в поддержку.' }, { status: 500 });
    }
}

// Маршрут "Создание акции"
export async function POST(request) {
    try {
        // Получение данных
        const query = await request.json();
        // Подключаемся к базе данных
        await connectToDatabase();
        // Получаем номер последней акции
        const lastPromotion = await Promotion.findOne().sort({ _id: -1 });
        const title_id = lastPromotion ? lastPromotion.title_id + 1 : 1;
        // Создаём новую акцию
        const promotion = new Promotion({ title_id, ...query });
        // Если акция не создалась
        if (!promotion) { return NextResponse.json({ error: 'Не удалось создать акцию.' }, { status: 404 }) };
        // Сохраняем акцию
        await promotion.save();
        // Создаём задачу в боте
        await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/schedule/promotions/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ promotion_id: promotion._id }),
        });
        // Отправляем данные
        return NextResponse.json({ response: promotion }, { status: 200 });
    } catch (e) {
        console.error('Ошибка при создании акции:', e);
        return NextResponse.json({ error: 'Что-то пошло не так. Попробуйте позже или обратитесь в поддержку.' }, { status: 500 });
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
    });
}