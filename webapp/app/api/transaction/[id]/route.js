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
        // Если транзраздачи нет
        if (!transactions) { return NextResponse.json({ access: true }, { status: 200 }) };
        // Отправляем данные
        return NextResponse.json({ access: false, response: transactions }, { status: 402 });
    } catch (e) {
        console.error('Ошибка при получении транзакций:', e);
        return NextResponse.json({ status: 500, error: 'Что-то пошло не так. Попробуйте позже или обратитесь в поддержку.' }, { status: 500 });
    }
}

// Маршрут "Удаление транзраздачи"
export async function PUT(request, ctx) {
    try {
        // Получаем id транзраздачи
        const { id } = await ctx?.params;
        // Получение данных
        const body = await request.json();
        // Подключаемся к базе данных
        await connectToDatabase();
        // Поиск и обновление транзакций
        const transactions = await Transaction.findByIdAndUpdate({ _id: id }, { $set: body }, { new: true });
        // Если транзраздачи нет
        if (!transactions) { return NextResponse.json({ error: 'Ошибка обновления транзраздачи.' }, { status: 404 }) };
        // Отправляем данные
        return NextResponse.json({ response: 'Успешное обновление транзраздачи.' }, { status: 200 });
    } catch (e) {
        console.error('Ошибка при обновлении транзраздачи:', e);
        return NextResponse.json({ status: 500, error: 'Что-то пошло не так. Попробуйте позже или обратитесь в поддержку.' }, { status: 500 });
    }
}

// Маршрут "Удаление транзраздачи"
export async function DELETE(request, ctx) {
    try {
        // Получаем id транзраздачи
        const { id } = await ctx?.params;
        // Подключаемся к базе данных
        await connectToDatabase();
        // Поиск транзакций
        const transactions = await Transaction.findByIdAndDelete(id);
        // Если транзраздачи нет
        if (!transactions) { return NextResponse.json({ error: 'Ошибка удаления транзраздачи.' }, { status: 404 }) };
        // Отправляем данные
        return NextResponse.json({ response: 'Успешное удаление транзраздачи.' }, { status: 402 });
    } catch (e) {
        console.error('Ошибка при удалении транзраздачи:', e);
        return NextResponse.json({ status: 500, error: 'Что-то пошло не так. Попробуйте позже или обратитесь в поддержку.' }, { status: 500 });
    }
}

// Настройка методов и заголовков
export async function OPTIONS() {
    return NextResponse.json(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_URL || '*',
            'Access-Control-Allow-Methods': 'GET, PUT, DELETE',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Max-Age': '3600',
        },
    });
}