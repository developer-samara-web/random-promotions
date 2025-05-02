// Импорты
import { NextResponse } from "next/server";
import connectToDatabase from "@/services/mongodb";
import Tariff from "@/models/Tariff";

// Маршрут "Получение тарифов"
export async function GET(request) {
    try {
        // Подключаемся к базе данных
        await connectToDatabase();
        // Получаем тариф
        const tariffs = await Tariff.find();
        // Если тарифа не существует
        if (!tariffs) { return NextResponse.json({ error: 'Тарифы не найдены. Попробуйте повторить попытку позже или обратитесь в службу поддержки.' }, { status: 404 }) };
        // Отправляем данные
        return NextResponse.json({ response: tariffs }, { status: 200 });
    } catch (e) {
        console.error('Ошибка при получении тарифа:', e);
        return NextResponse.json({ error: 'Что-то пошло не так. Попробуйте повторить попытку позже или обратитесь в поддержку.' }, { status: 500 });
    }
}

// Маршрут "Создание тарифа"
export async function POST(request) {
    try {
        // Получение данных
        const query = await request.json();
        // Подключаемся к базе данных
        await connectToDatabase();
        // Создаём новый тариф
        const tariff = new Tariff(query);
        // Если раздача не создалась
        if (!tariff) { return NextResponse.json({ error: 'Не удалось создать тариф.' }, { status: 404 }) };
        // Сохраняем акцию
        await tariff.save();
        // Отправляем данные
        return NextResponse.json({ response: tariff }, { status: 200 });
    } catch (e) {
        console.error('Ошибка при создании тарифа:', e);
        return NextResponse.json({ error: 'Что-то пошло не так. Попробуйте позже или обратитесь в поддержку.' }, { status: 500 });
    }
}

// Настройка методов и заголовков
export async function OPTIONS() {
    return NextResponse.json(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_URL || '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Max-Age': '3600',
        },
    })
}