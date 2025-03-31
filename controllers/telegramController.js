// Импорты
import { chanelKeyboard } from "#keyboards/chanelKeyboard.js";
import { resultMessage } from "#messages/postMessages.js";

// Логирование
import logger from "#utils/logs.js";

// Отправка поста акции
export async function sendPromotionPost(telegram, promotion) {
    try {
        // Отправляем сообщение в телеграм
        return await telegram.telegram.sendPhoto(
            process.env.TELEGRAM_GROUP_ID,
            promotion.banner_image,
            {
                caption: `${promotion.title}\n\n${promotion.description}`,
                parse_mode: 'HTML',
                reply_markup: chanelKeyboard(promotion._id).reply_markup,
            }
        )
    } catch (e) {
        logger.error('Ошибка отправки поста в телеграм:', e);
    }
};

// Отправка поста результатов
export async function sendResultPost(telegram, promotion, winners) {
    try {
        // Отправляем сообщение в телеграм
        return await telegram.telegram.sendMessage(
            process.env.TELEGRAM_GROUP_ID,
            resultMessage(promotion, winners),
            {
                reply_to_message_id: promotion.message_id,
                parse_mode: 'HTML'
            }
        );
    } catch (e) {
        logger.error('Ошибка отправки поста в телеграм:', e);
    }
};

// Обновляем сообщение
export async function updatePost(telegram, promotion, counter = null) {
    try {
        return await telegram.telegram.editMessageCaption(
            process.env.TELEGRAM_GROUP_ID,
            promotion.message_id,
            null,
            `${promotion.title}\n\n${promotion.description}`,
            {
                parse_mode: 'HTML',
                reply_markup: counter ? chanelKeyboard(promotion._id, counter).reply_markup : null,
            }
        );
    } catch (e) {
        logger.error('Ошибка обновления поста в телеграм:', e);
    }
};