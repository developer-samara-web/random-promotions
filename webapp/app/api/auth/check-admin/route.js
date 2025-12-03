// Импорты
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import connectToDatabase from '@/services/mongodb';
import User from '@/models/User';

// Роут "Проверка прав администратора"
export async function GET(request) {
    // Получаем токен из куки
    const authToken = request.cookies.get("authToken");
    // Проверяем наличие токена
    if (!authToken) { return NextResponse.json({ error: "Необходима авторизация" }, { status: 401 }) };

    try {
        // Проверяем токен
        const { payload } = await jwtVerify(authToken.value, new TextEncoder().encode(process.env.TELEGRAM_JWT_TOKEN));
        // Получаем ID пользователя
        const { id } = payload;
        // Подключаемся к базе данных
        await connectToDatabase();
        // Находим пользователя по ID
        const user = await User.findOne({ telegram_id: id });
        // Проверяем наличие пользователя и роль
        if (!user || !user.is_admin) { return NextResponse.json({ isAdmin: false }, { status: 403 }) };
        // Возвращаем ответ
        return NextResponse.json({ isAdmin: true });
    } catch (e) {
        console.error("Ошибка проверки прав пользователя:", e);
        return NextResponse.json({ error: "Ошибка проверки прав пользователя." }, { status: 500 });
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
    });
}