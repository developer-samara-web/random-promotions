// Импорт компонентов
import { NextResponse } from 'next/server';
import connectToDatabase from '@/services/mongodb';
import Promotion from '@/models/Promotion';
import User from '@/models/User';

// Регистрация в акции
export async function POST(request) {
    try {
        // Получение данных
        const query = await request.json();
        // Подключаемся к базе данных
        await connectToDatabase();
        // Получаем пользователя
        const user = await User.findOne({ telegram_id: query.telegram_id });
        // Если пользователь не найден
        if (!user) { return NextResponse.json({ status: 404, error: 'Пользователь не найден.' }) }
        // Получаем акцию
        const promotion = await Promotion.findById(query.promotion_id);
        // Если акции не найдена
        if (!promotion) { return NextResponse.json({ status: 404, error: 'Акция не найдена. Попробуйте повторить попытку позже или обратитесь в службу поддержки.' }) }
        // Проверяем, есть ли пользователь в participants
        const isUserAlreadyParticipant = promotion.participants.some(
            participant => participant.user.toString() === user._id.toString()
        );
        // Если пользователь уже участвует, возвращаем ошибку
        if (isUserAlreadyParticipant) { return NextResponse.json({ status: 400, error: 'Вы уже участвуете в акции. Дождитесь конца акции.' }) }
        // Добавляем пользователя в participants
        promotion.participants.push({ user: user._id, status: 'pending', date: new Date() });
        user.participation.push({ promotion: promotion._id.toString(), status: 'pending', date: new Date() });
        // Сохраняем обновлённую акцию
        await promotion.save();
        await user.save();
        // Отправляем данные
        return NextResponse.json({ status: 200, response: promotion });
    } catch (error) {
        console.error('Ошибка при получении акции:', error);
        return NextResponse.json({ status: 500, error: 'Что-то пошло не так. Попробуйте повторить попытку позже или обратитесь в поддержку.' });
    }
}