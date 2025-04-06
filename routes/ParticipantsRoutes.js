// Импорты
import { getParticipants } from "#controllers/participantsController.js";
import { getPromotion } from "#controllers/promotionController.js";
import { updatePost } from "#controllers/telegramController.js";

// Логирование
import logger from "#utils/logs.js";

// Маршруты "Участие"
export default async function (app, telegram) {
    // Создание участия
    app.post('/participants/update', async (req, res) => {
        try {
            // Получаем id акции
            const { promotion_id } = req.body;
            // Получаем время акции
            const promotion = await getPromotion(promotion_id);
            // Получаем участников
            const participants = await getParticipants(promotion_id);
            // Обновляем пост телеграмм
            await updatePost(telegram, promotion, participants);
            logger.info(`Пост обновлён: ${process.env.TELEGRAM_CHANEL_URL}/${promotion.message_id}`);
            return res.status(200).json({ status: 'success' });
        } catch (e) {
            return res.status(403).send(`Ошибка доступа.`);
        }
    });
}