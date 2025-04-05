// Импорты
import { NextResponse } from "next/server";
import connectToDatabase from "@/services/mongodb";
import Transaction from "@/models/Transaction";

// Маршрут "Создание транзакции"
export async function POST(request) {
    try {
        // Подключаемся к базе данных
        await connectToDatabase();
        // Получаем данные
        const { user_id, tariff_id } = await request.json();
        // Создаём транзакцию
        const transaction = new Transaction({ user_id, tariff_id });
        // Если транзакции нет
        if (!transaction) { return NextResponse.json({ error: 'Не удалось создать транзакцию.' }, { status: 404 }) };
        // Сохраняем транзакцию
        await transaction.save();
        // Отправляем данные
        return NextResponse.json({ response: transaction }, { status: 200 });
    } catch (e) {
        console.error('Ошибка при создании транзакции:', e);
        return NextResponse.json({ status: 500, error: 'Что-то пошло не так. Попробуйте позже или обратитесь в поддержку.' }, { status: 500 });
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
    });
}