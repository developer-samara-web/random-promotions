// Импорты
import { chanelKeyboard, winnerKeyboard } from "#keyboards/chanelKeyboard.js";
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
                reply_markup: chanelKeyboard(promotion).reply_markup,
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
                disable_web_page_preview: true,
                parse_mode: 'HTML'
            }
        );
    } catch (e) {
        logger.error('Ошибка отправки поста в телеграм:', e);
    }
};

// Контроллер "Обновление поста акции"
export async function updatePost(telegram, promotion, counter = null, retries = 3) {
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
        // Проверяем, является ли ошибка 429
        if (e.message.includes('429: Too Many Requests') && retries > 0) {
            // Извлекаем время ожидания из сообщения об ошибке
            const retryAfterMatch = e.message.match(/retry after (\d+)/);
            const retryAfter = retryAfterMatch ? parseInt(retryAfterMatch[1], 10) * 1000 : 5000;
            logger.warn(`Получена ошибка 429, повторная попытка через ${retryAfter / 1000} секунд. Осталось попыток: ${retries}`);
            // Ждем перед повторной попыткой
            await new Promise((resolve) => setTimeout(resolve, retryAfter));
            // Повторяем запрос с уменьшенным количеством попыток
            return await updatePost(telegram, promotion, counter, retries - 1);
        } else {
            // Логируем другие ошибки
            logger.error('Ошибка обновления поста в Telegram:', e);
            throw e; // Пробрасываем ошибку дальше, если не 429 или закончились попытки
        }
    }
};

// Контроллер "Уведомление о победе в личном сообщении"
export async function sendWinnerPost(telegram, promotion, user) {
    try {
        const post = `${process.env.TELEGRAM_CHANEL_URL}/${promotion.message_id}`;

        return await telegram.telegram.sendMessage(
            user.telegram_id,
            winnerMessage(promotion, post),
            {
                parse_mode: 'HTML',
                disable_web_page_preview: false,
                reply_markup: winnerKeyboard().reply_markup
            }
        );
    } catch (e) {
        logger.error('Ошибка отправки поста с победителями:', e);
    }
};