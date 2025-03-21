// Импорт компонентов
import { NextResponse } from "next/server";
import connectToDatabase from '@/services/mongodb';
import User from "@/_models/User";
import crypto from "crypto";
import jwt from "jsonwebtoken";

// Авторизация продавца
export async function POST(request) {
    try {
        // Подключаемся к базе данных
        await connectToDatabase();
        // Получаем данные пользователя из запроса
        const initData = await request.json();
        // Если данные пустые, возвращаем ошибку
        if (!initData) { return NextResponse.json({ status: 400, error: "Данные пользователя пусты." }) }
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
        const seller = await User.find({telegram_id: telegram_id});
        // Проверка на существование администратора
        if (!seller.length) { return NextResponse.json({ status: 400, error: "Вы не прошли авторизацию. Ваши данные отличаются от данных в нашей системе. Если проблема повторяется, пожалуйста, свяжитесь с нашей технической поддержкой для уточнения причин @lavka_dobbi_support." }) }
        // Создаем секретный ключ
        const secretKey = crypto.createHmac('sha256', 'WebAppData')
            .update(process.env.BOT_SELLER_TOKEN)
            .digest()
        // Вычисляем подпись на основе строки проверки
        const signature = crypto.createHmac('sha256', secretKey)
            .update(checkString)
            .digest('hex')
        // Сравниваем хэши
        if (data.hash !== signature) { return NextResponse.json({ status: 403, error: "Неверные данные продавца. Если проблема повторяется, пожалуйста, свяжитесь с нашей технической поддержкой для уточнения причин @lavka_dobbi_support." }) }
        // Получаем пользователя
        const user = JSON.parse(decodeURIComponent(data.user));
        // Проверяем данные пользователя
        if (!user?.id || !user?.username) { return NextResponse.json({ status: 400, error: "Некорректные данные продавца. Если проблема повторяется, пожалуйста, свяжитесь с нашей технической поддержкой для уточнения причин @lavka_dobbi_support." }) }
        // Генерируем JWT токен
        const token = jwt.sign({ id: user.id, username: user.username, }, process.env.JWT_SECRET, { expiresIn: "60m" })
        // Устанавливаем токен в куки
        const response = NextResponse.json({ message: "Успешная авторизация." });
        // Устанавливаем куки с токеном
        response.cookies.set("authToken", token, { httpOnly: true, secure: true, sameSite: "strict", path: "/", maxAge: 60 * 60 });
        // Ответаем клиенту
        return response;
    } catch (error) {
        console.error("Ошибка в обработке запроса:", error);
        return NextResponse.json({ status: 500, error: "Внутренняя ошибка сервера." });
    }
}