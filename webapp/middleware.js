import { NextResponse } from "next/server"
import { jwtVerify } from 'jose'

// Проверка токена авторизации
export async function middleware(request) {
    // Получаем токен из cookies
    const authToken = request.cookies.get("authToken")
    // Если токен отсутствует, возвращаем ошибку авторизации
    if (!authToken) { return NextResponse.json({ status: 401, error: "У вас не достаточно прав для работы с этой страницей. Попробуйте повторить попытку позже или обратитесь в службу поддержки." }) }

    try {
        // Проверяем токен
        const user = await jwtVerify(authToken.value, new TextEncoder().encode(process.env.JWT_SECRET))
        // Если токен валидный
        request.headers.set("user", JSON.stringify(user))
    } catch (error) {
        // Если токен не валидный
        return NextResponse.json({ status: 401, message: 'У вас не достаточно прав для работы с этой страницей.' })
    }
}

// Защищенные маршруты
export const config = {
    matcher: [
        "/api/admins/:path*",
        "/api/category/:path*",
        "/api/invites/:path*",
        "/api/notifications/:path*",
        "/api/permission/:path*",
        "/api/pricings/:path*",
        "/api/promotions/:path*",
        "/api/publications/:path*",
        "/api/requests/:path*",
        "/api/schedules/:path*",
        "/api/sellers/:path*",
        "/api/settings/:path*",
        "/api/statistics/:path*",
        "/api/teams/:path*",
        "/api/upload/:path*",
        "/api/users/:path*"
    ]
}