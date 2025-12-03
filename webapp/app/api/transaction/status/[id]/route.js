// Импорты
import { NextResponse } from "next/server";
import connectToDatabase from "@/services/mongodb";
import Transaction from "@/models/Transaction";

// Маршрут "Получение данных о транзраздачии"
export async function GET(request, ctx) {
    try {
        // Получаем id пользователя
        const { id } = await ctx?.params;
        // Подключаемся к базе данных
        await connectToDatabase();
        // Поиск транзакций
        const transaction = await Transaction.findOne({ _id: id, });
        // Если транзраздачи нет
        if (!transaction) { return NextResponse.json({ error: true }, { status: 404 }) };
        // Отправляем данные
        return NextResponse.json({ response: transaction }, { status: 200 });
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
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Max-Age': '3600',
        },
    });
}