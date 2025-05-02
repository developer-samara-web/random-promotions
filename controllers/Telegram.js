// Импорты
import { ResultMessage, WinnerMessage } from "#messages/Promotion.js";
import { PaymentSuccessMessage, PaymentErrorMessage } from "#messages/Payment.js";
import { chanelKeyboard } from "#keyboards/Channel.js";
import { MainMenuKeyboard } from "#keyboards/Main.js";

// Логирование
import logger from "#utils/logs.js";

// Контроллер "Отправка поста раздачи"
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
            ResultMessage(promotion, winners),
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

// Контроллер "Обновление поста раздачи"
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
            WinnerMessage(promotion, post),
            {
                parse_mode: 'HTML',
                disable_web_page_preview: false,
                reply_markup: MainMenuKeyboard().reply_markup
            }
        );
    } catch (e) {
        logger.error('Ошибка отправки поста с победителями:', e);
    }
};

// Контроллер "Уведомление об успешной оплате"
export async function sendPaymentSuccesPost(telegram, chat_id, message_id, end_date) {
    try {
        return await telegram.telegram.editMessageText(
            chat_id,
            message_id,
            null,
            PaymentSuccessMessage(end_date),
            {
                parse_mode: 'HTML',
                disable_web_page_preview: false,
                reply_markup: MainMenuKeyboard().reply_markup
            }
        );
    } catch (e) {
        logger.error('Ошибка отправки поста с победителями:', e);
    }
};

// Контроллер "Уведомление об неуспешной оплате"
export async function sendPaymentFailedPost(telegram, chat_id, message_id, user) {
    try {
        return await telegram.telegram.editMessageText(
            chat_id,
            message_id,
            null,
            PaymentErrorMessage(user.subscription.end_date),
            {
                parse_mode: 'HTML',
                disable_web_page_preview: false,
                reply_markup: MainMenuKeyboard().reply_markup
            }
        );
    } catch (e) {
        logger.error('Ошибка отправки поста с победителями:', e);
    }
};