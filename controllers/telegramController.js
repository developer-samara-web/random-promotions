// Импорты
import { chanelKeyboard } from "#keyboards/chanelKeyboard.js";
import { resultMessage, winnerMessage } from "#messages/postMessages.js";

// Логирование
import logger from "#utils/logs.js";

// Контроллер "Отправка поста акции"
export async function sendPromotionPost(telegram, promotion) {
    try {
        // Отправляем сообщение в телеграм
        return await telegram.telegram.sendPhoto(
            process.env.TELEGRAM_GROUP_ID,
            promotion.banner_image,
            {
                caption: `${promotion.title}\n\n${promotion.description}`,
                parse_mode: 'HTML',
                ...chanelKeyboard(promotion)
            }
        )
    } catch (e) {
        logger.error('Ошибка отправки поста в телеграм:', e);
    }
};

// Контроллер "Отправка поста результатов"
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

// Контроллер "Обновление поста акции"
export async function updatePost(telegram, promotion, counter = null) {
    try {
        // Проверяем данные
        if (!promotion.message_id) { throw new Error('Не указан message_id') }

        return await telegram.telegram.editMessageCaption(
            process.env.TELEGRAM_GROUP_ID,
            promotion.message_id,
            null,
            `${promotion.title}\n\n${promotion.description}`,
            {
                parse_mode: 'HTML',
                reply_markup: counter ? chanelKeyboard(promotion, counter).reply_markup : null,
            }
        );
    } catch (e) {
        logger.error('Ошибка обновления поста в телеграм:', e);
    }
};

// Контроллер "Уведомление о победе в личном сообщении"
export async function sendWinnerPost(telegram, promotion, user) {
    try {
        const post = `https://t.me/etetettetetetettet/${promotion.message_id}`;

        return await telegram.telegram.sendMessage(
            user.telegram_id,
            winnerMessage(promotion, post),
            {
                parse_mode: 'HTML',
                disable_web_page_preview: false
            }
        );
    } catch (e) {
        logger.error('Ошибка отправки поста с победителями:', e);
    }
};