// Импорты
import { NextResponse } from "next/server";
import connectToDatabase from '@/services/mongodb';
import User from "@/models/User";
import jwt from "jsonwebtoken";
import crypto from "crypto";

// Маршрут "Авторизация пользователя"
export async function POST(request) {
    try {
        // Подключаемся к базе данных
        await connectToDatabase();
        // Получаем данные пользователя из запроса
        const initData = await request.json();
        // Если данные пустые, возвращаем ошибку
        if (!initData) { return NextResponse.json({ status: 400, error: "Данные пользователя пусты." }) };
        // Проверяем токен бота
        const urlSearchParams = new URLSearchParams(initData);
        const data = Object.fromEntries(urlSearchParams.entries());
        // Создаем строку проверки, исключая hash
        const checkString = Object.keys(data)
            .filter(key => key !== 'hash')
            .map(key => `${key}=${data[key]}`)
            .sort()
            .join('\n')
        // Получаем данные администратора из базы данных
        const telegram_id = JSON.parse(data.user).id;
        const userData = await User.find({ telegram_id: telegram_id });
        // Проверка на существование администратора
        if (!userData.length) { return NextResponse.json({ access: 'registration' }, { status: 401 }) };
        // Создаем секретный ключ
        const secretKey = crypto.createHmac('sha256', 'WebAppData')
            .update(process.env.TELEGRAM_TOKEN)
            .digest()
        // Вычисляем подпись на основе строки проверки
        const signature = crypto.createHmac('sha256', secretKey)
            .update(checkString)
            .digest('hex')
        // Сравниваем хэши
        if (data.hash !== signature) { return NextResponse.json({ error: "Данные пользователя не верны. Если проблема повторяется, пожалуйста, свяжитесь с нашей технической поддержкой для уточнения причин." }, { status: 401 }) };
        // Получаем пользователя
        const user = JSON.parse(decodeURIComponent(data.user));
        // Проверяем данные пользователя
        if (!user?.id || !user?.username) { return NextResponse.json({ error: "Данные пользователя не верны. Если проблема повторяется, пожалуйста, свяжитесь с нашей технической поддержкой для уточнения причин." }, { status: 401 }) };
        // Генерируем JWT токен
        const token = jwt.sign({ id: user.id, username: user.username }, process.env.TELEGRAM_JWT_TOKEN, { expiresIn: "60m" });
        // Устанавливаем токен в куки
        const response = NextResponse.json({ message: "Успешная авторизация." }, { status: 200 });
        // Устанавливаем куки с токеном
        response.cookies.set("authToken", token, { httpOnly: true, secure: true, sameSite: "none", path: "/", maxAge: 60 * 60 });
        // Ответаем клиенту
        return response;
    } catch (e) {
        console.error("Ошибка в обработке запроса:", e);
        return NextResponse.json({ error: "Внутренняя ошибка сервера." }, { status: 500 });
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