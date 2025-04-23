// Импорты
import { NextResponse } from "next/server";
import connectToDatabase from "@/services/mongodb";
import Transaction from "@/models/Transaction";

// Маршрут "Получение данных о транзакциии"
export async function GET(request, ctx) {
    try {
        // Получаем id пользователя
        const { id } = await ctx?.params;
        // Подключаемся к базе данных
        await connectToDatabase();
        // Поиск транзакций
        const transaction = await Transaction.findOne({ _id: id, });
        // Если транзакции нет
        if (!transaction) { return NextResponse.json({ error: true }, { status: 404 }) };
        // Отправляем данные
        return NextResponse.json({ response: transaction }, { status: 200 });
    } catch (e) {
        console.error('Ошибка при получении транзакций:', e);
        return NextResponse.json({ status: 500, error: 'Что-то пошло не так. Попробуйте позже или обратитесь в поддержку.' }, { status: 500 });
    }
}

// Маршрут "Удаление транзакции"
export async function PUT(request, ctx) {
    try {
        // Получаем id транзакции
        const { id } = await ctx?.params;
        // Получение данных
        const body = await request.json();
        // Подключаемся к базе данных
        await connectToDatabase();
        // Поиск и обновление транзакций
        const transactions = await Transaction.findByIdAndUpdate({ _id: id }, { $set: body }, { new: true });
        // Если транзакции нет
        if (!transactions) { return NextResponse.json({ error: 'Ошибка обновления транзакции.' }, { status: 404 }) };
        // Отправляем данные
        return NextResponse.json({ response: 'Успешное обновление транзакции.' }, { status: 200 });
    } catch (e) {
        console.error('Ошибка при обновлении транзакции:', e);
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
        const transactions = await Transaction.findByIdAndDelete(id);
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
            'Access-Control-Allow-Methods': 'GET, PUT, DELETE',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Max-Age': '3600',
        },
    });
}