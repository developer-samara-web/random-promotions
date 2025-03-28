// Импорт компонентов
import { getUser } from "@/controllers/Users";
import { getPromotion } from "@/controllers/Promotions";
import { getParticipant, getParticipantLimit } from "@/controllers/Participant";

// Крмпонент
export async function participantMiddleware(telegram_id, promotion_id, setSuccess) {
    try {
        // Проверка полученных данных
        if (!promotion_id || !telegram_id) { return { error: { message: 'Ошибка получения данных. Если проблема повторяется, пожалуйста, свяжитесь с нашей технической поддержкой для уточнения причин.' } } };

        // Получение данных пользователя
        const user = await getUser(telegram_id);

        // Проверка данных
        if (user.error) { return { error: { message: 'Ошибка данных, пользователь не найден.' } } };

        // Получаем данные акции
        const promotion = await getPromotion(promotion_id);

        // Проверка данных
        if (promotion.error) { return { error: { message: 'Ошибка данных, акция не найдена.' } } };

        // Получаем данные участника
        const participant = await getParticipant(user.response._id, promotion_id);

        // Проверка участия
        if (!participant.access) { 
            return { doubble: true, access: { message: 'Вы уже участвуете в акции.', promotion, user } }
        };

        // Проверка активности акции
        if (promotion.response.status === "draft") {
            return { error: { message: 'Акция в данный момент не активна. Если проблема повторяется, пожалуйста, свяжитесь с нашей технической поддержкой для уточнения причин.' } };
        }

        if (promotion.response.status === "completed") {
            return { error: { message: 'Акция в данный момент завершена. Если проблема повторяется, пожалуйста, свяжитесь с нашей технической поддержкой для уточнения причин.' } };
        }

        // Проверка премиума
        if (promotion.response.requires_subscription && !user.response.subscription?.is_active) {
            return {
                error: {
                    message: 'Упс! Кажется у вас не активирована ⭐️ Премиум подписка! \nДанная Раздача доступна только для ⭐️ премиум подписчиков нашего канала. 🤩Прямо сейчас вы можете оформить подписку всего за 1 рубль!',
                    buttons: { name: 'Оформить подписку', url: process.env.NEXT_PUBLIC_TELEGRAM_BOT_URL, icon: 'ArrowRightCircleIcon' }
                }
            };
        }

        // Проверка подписки на канал
        if (!user.response.channel_subscription) {
            return {
                error: {
                    message: '🚀 Хотите выиграть приз? Сначала подпишитесь на канал! Только подписчики получают уведомления о розыгрышах — не пропустите свой шанс!',
                    buttons: { name: 'Подписаться', url: process.env.NEXT_PUBLIC_TELEGRAM_CHANEL_URL, icon: 'ArrowRightCircleIcon' }
                }
            };
        }

        // Проверка лимита участий в месяц
        const limit = await getParticipantLimit(user.response._id)
        if (!limit.access) { return { error: { message: 'Вы превысили лимит участий в месяц.' } } };

        // Если все проверки пройдены
        return { access: { status: true, promotion, user } };
    } catch (e) {
        return { error: { message: 'Произошла непредвиденная ошибка. Пожалуйста, свяжитесь с технической поддержкой.' } };
    }
}