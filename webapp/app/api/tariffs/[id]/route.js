// Импорты
import { NextResponse } from 'next/server'
import connectToDatabase from '@/services/mongodb'
import Tariff from '@/models/Tariff'

// Маршрут "Получение тарифа"
export async function GET(request, ctx) {
    try {
        // Получаем id тарифа
        const { id } = await ctx?.params;
        // Проверяем id тарифа
        if (id === 'undefined') { return NextResponse.json({ error: 'Ошибка при загрузке данных тарифа. Если проблема повторяется, пожалуйста, свяжитесь с нашей технической поддержкой для уточнения причин.' }, { status: 404 }) };
        // Подключаемся к базе данных
        await connectToDatabase();
        // Получаем тариф
        const tariff = await Tariff.findById(id);
        // Если тарифа не существует
        if (!tariff) { return NextResponse.json({ error: 'Тариф не найден. Попробуйте повторить попытку позже или обратитесь в службу поддержки.' }, { status: 404 }) };
        // Отправляем данные
        return NextResponse.json({ response: tariff }, { status: 200 });
    } catch (e) {
        console.error('Ошибка при получении тарифа:', e);
        return NextResponse.json({ error: 'Что-то пошло не так. Попробуйте повторить попытку позже или обратитесь в поддержку.' }, { status: 500 });
    }
}

// Настройка методов и заголовков
export async function OPTIONS() {
    return NextResponse.json(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Max-Age': '3600',
        },
    })
}