// Импорт компонентов
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request) {
    // Получаем токен из cookies
    const authToken = request.cookies.get("authToken");
    // Если токен отсутствует, возвращаем ошибку авторизации
    if (!authToken) { return NextResponse.json({ status: 401, error: "У вас не достаточно прав для работы с этой страницей. Попробуйте повторить попытку позже или обратитесь в службу поддержки." }) }

    try {
        // Проверяем токен
        const user = await jwtVerify(authToken.value, new TextEncoder().encode(process.env.TELEGRAM_JWT_TOKEN));
        // Если токен валидный
        request.headers.set("user", JSON.stringify(user));
    } catch (e) {
        // Если токен не валидный
        return NextResponse.json({ status: 401, message: 'У вас не достаточно прав для работы с этой страницей. Попробуйте повторить попытку позже или обратитесь в службу поддержки.' });
    }
}

export const config = {
    matcher: [
        '/api/promotions/:path*',
    ],
};