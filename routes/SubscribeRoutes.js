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
            // Получаем подписку на канал
            const subscribe = await telegram.telegram.getChatMember(process.env.TELEGRAM_GROUP_ID, telegram_id);
            // Проверяем полученные данные
            if (!subscribe) { return res.status(200).send({ access: false }); }
            // Обновляем данные пользователя
            await updateUser(telegram_id, { channel_subscription: true })
            // Отправляем данные
            logger.info(`Успешная проверка подписки: ${telegram_id}`)
            return res.status(200).json({ access: true });
        } catch (e) {
            return res.status(403).send(`Ошибка доступа.`);
        }
    });
}