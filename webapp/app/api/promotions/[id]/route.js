import { NextResponse } from 'next/server'
import connectToDatabase from '@/services/mongodb'
import Promotion from '@/models/Promotion'

// Получаем список администраторов
export async function GET(request, { params: { id }}) {
    try {
        // Подключаемся к базе данных
        await connectToDatabase();
        // Получаем акцию
        const promotion = await Promotion.find(id);
        // Если акции не существует
        if (!promotion) { return NextResponse.json({ status: 404, error: 'Акция не найдена.' }) }
        // Отправляем данные
        return NextResponse.json({ status: 200, response: promotion })
    } catch (error) {
        console.error('Ошибка при получении акции:', error);
        return NextResponse.json({ status: 500, error: 'Что-то пошло не так. Попробуйте повторить попытку позже или обратитесь в поддержку.' })
    }
}

// Редактирование акции
export async function PUT(request) {
    try {
        // Подключаемся к базе данных
        await connectToDatabase();
        // Получение данных
        const query = await request.json();
        // Получаем список
        const promotion = new Promotion(query);
        // Если приглашений нет
        if (!promotion) { return NextResponse.json({ status: 404, error: 'Не удалось отредактировать акцию.' }) }
        // Сохраняем
        await Promotion.save()
        // Отправляем данные
        return NextResponse.json({ status: 200, response: promotion })
    } catch (error) {
        console.error('Ошибка при создании акции:', error)
        return NextResponse.json({ status: 500, error: 'Что-то пошло не так. Попробуйте повторить попытку позже или обратитесь в поддержку.' })
    }
}

// Настройка методов и заголовков
export async function OPTIONS() {
    return NextResponse.json(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': process.env.APP_URL,
            'Access-Control-Allow-Methods': 'GET, PUT',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Max-Age': '3600',
        },
    })
}