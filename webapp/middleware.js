// Импорт компонентов
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request) {
    const authToken = request.cookies.get("authToken");

    if (!authToken) {
        // Перенаправляем на главную, если токена нет
        // return NextResponse.redirect(new URL('/', request.url));
        if (!authToken) { return NextResponse.json({ status: 401, error: "У вас не достаточно прав для работы с этой страницей. Попробуйте повторить попытку позже или обратитесь в службу поддержки." }) }
    }

    try {
        const { payload } = await jwtVerify(authToken.value, new TextEncoder().encode(process.env.TELEGRAM_JWT_TOKEN));
        request.headers.set("user", JSON.stringify(payload)); // Передаем данные пользователя
        return NextResponse.next();
    } catch (error) {
        console.error("Ошибка в middleware:", error);
        // return NextResponse.redirect(new URL('/', request.url));
        return NextResponse.json({ status: 401, message: 'У вас не достаточно прав для работы с этой страницей.' })
    }
}

// export const config = {
//     matcher: [
//         '/',                  // Главная страница
//         '/promotions/:path*', // Все маршруты под /promotions
//     ],
// };