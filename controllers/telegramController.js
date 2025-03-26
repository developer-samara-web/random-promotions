import { chanelKeyboard } from "#keyboards/chanelKeyboard.js"

// Логирование
import logger from "#utils/logs.js";

// Отправка поста
export async function addPost(telegram, promotion) {
    try {
        // Отправляем сообщение в телеграм
        await telegram.telegram.sendPhoto(
            process.env.TELEGRAM_GROUP_ID,
            promotion.image,
            {
                caption: `${promotion.name}\n\n${promotion.description}`,
                parse_mode: 'HTML',
                reply_markup: chanelKeyboard(promotion._id).reply_markup,
            }
        )
    } catch (e) {
        logger.error('Ошибка отправки поста в телеграм:', e);
    }
};