// Импорты
import { NextResponse } from "next/server";
import connectToDatabase from "@/services/mongodb";
import Transaction from "@/models/Transaction";

// Маршрут "Получение данных о транзакциях пользователя"
export async function GET(request, ctx) {
    try {
        // Получаем id пользователя
        const { id } = await ctx?.params;
        // Подключаемся к базе данных
        await connectToDatabase();
        // Поиск транзакций
        const transactions = await Transaction.findOne({ user_id: id, status: "in_progress" });
        // Если транзакции нет
        if (!transactions.length) { return NextResponse.json({ access: true }, { status: 200 }) };
        // Отправляем данные
        return NextResponse.json({ access: false, response: transactions }, { status: 402 });
    } catch (e) {
        console.error('Ошибка при получении транзакций:', e);
        return NextResponse.json({ status: 500, error: 'Что-то пошло не так. Попробуйте позже или обратитесь в поддержку.' }, { status: 500 });
    }
}

// Маршрут "Удаление транзакции"
export async function DELETE(request, ctx) {
    try {
        // Получаем id транзакции
        const { id } = await ctx?.params;
        // Подключаемся к базе данных
        await connectToDatabase();
        // Поиск транзакций
        const transactions = await Transaction.findById(id);
        // Если транзакции нет
        if (!transactions) { return NextResponse.json({ error: 'Ошибка удаления транзакции.' }, { status: 404 }) };
        // Отправляем данные
        return NextResponse.json({ response: 'Успешное удаление транзакции.' }, { status: 402 });
    } catch (e) {
        console.error('Ошибка при удалении транзакции:', e);
        return NextResponse.json({ status: 500, error: 'Что-то пошло не так. Попробуйте позже или обратитесь в поддержку.' }, { status: 500 });
    }
}

// Настройка методов и заголовков
export async function OPTIONS() {
    return NextResponse.json(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_URL || '*',
            'Access-Control-Allow-Methods': 'GET, DELETE',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Max-Age': '3600',
        },
    });
}