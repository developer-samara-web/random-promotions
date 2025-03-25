// Импорт компонентов
import { NextResponse } from 'next/server';
import connectToDatabase from '@/services/mongodb';
import User from '@/models/User';

// Получаем данные пользователя
export async function GET(request, ctx) {
    try {
        // Получаем id акции
        const { id } = await ctx?.params;
        // Проверяем id акции
        if (id === 'undefined') { return NextResponse.json({ status: 404, error: 'Ошибка при загрузке акции. Если проблема повторяется, пожалуйста, свяжитесь с нашей технической поддержкой для уточнения причин.' }) }
        // Подключаемся к базе данных
        await connectToDatabase();
        // Получаем акцию
        const user = await User.findOne({ telegram_id: id });
        // Если акции не существует
        if (!user) { return NextResponse.json({ status: 404, error: 'Акция не найдена. Попробуйте повторить попытку позже или обратитесь в службу поддержки.' }) }
        // Отправляем данные
        return NextResponse.json({ status: 200, response: user })
    } catch (error) {
        console.error('Ошибка при получении акции:', error);
        return NextResponse.json({ status: 500, error: 'Что-то пошло не так. Попробуйте повторить попытку позже или обратитесь в поддержку.' })
    }
}