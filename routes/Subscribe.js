// Импорты
import { updateUser } from "#controllers/User.js";

// Логирование
import logger from "#utils/logs.js";

// Маршруты "Подписка"
export default async function (app, telegram) {
    // Проверка подписки на канал
    app.post('/user/subscribe', async (req, res) => {
        try {
            // Получаем id акции
            const { telegram_id } = req.body;
            // Получаем подписку на канал
            const subscribe = await telegram.telegram.getChatMember(process.env.TELEGRAM_GROUP_ID, telegram_id);
            // Отправляем данные
            if (subscribe.status === 'left') {
                // Обновляем данные пользователя
                await updateUser(telegram_id, { channel_subscription: false })
                logger.info(`Неудачная проверка подписки: ID:${telegram_id}`)
                return res.status(200).send({ access: false });
            } else {
                // Обновляем данные пользователя
                await updateUser(telegram_id, { channel_subscription: true })
                logger.info(`Успешная проверка подписки: ID:${telegram_id}`)
                return res.status(200).json({ access: true });
            }
        } catch (e) {
            return res.status(403).send(`Ошибка доступа.`);
        }
    });
}