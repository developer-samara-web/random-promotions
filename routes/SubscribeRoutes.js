// Импорты
import { updateUser } from "#controllers/userController.js";

// Логирование
import logger from "#utils/logs.js";

// Маршруты "Подписка"
export default async function (app, telegram) {
    // Проверка подписки на канал
    app.post('/user/subscribe', async (req, res) => {
        try {
            // Получаем id акции
            const { telegram_id } = req.body;
            // Получаем текущий статус подписки
            const user = await getUser(telegram_id);
            const status = user?.channel_subscription;
            // Получаем подписку на канал
            const subscribe = await telegram.telegram.getChatMember(process.env.TELEGRAM_GROUP_ID, telegram_id);
            // Определяем новый статус подписки
            const newStatus = subscribe.status !== 'left';
            // Проверяем, изменился ли статус
            if (status !== newStatus) {
                // Обновляем данные пользователя только если статус изменился
                await updateUser(telegram_id, { channel_subscription: newStatus });

                // Логируем изменение
                if (newStatus) {
                    logger.info(`Пользователь подписался: ID:${telegram_id}`);
                } else {
                    logger.info(`Пользователь отписался: ID:${telegram_id}`);
                }
            }
            // Отправляем данные
            return res.status(200).json({ access: newStatus });
        } catch (e) {
            return res.status(403).send(`Ошибка доступа.`);
        }
    });
}