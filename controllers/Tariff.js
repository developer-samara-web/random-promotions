// Импорты
import connectToDatabase from "#services/Mongodb.js";
import Tariff from "#models/Tariff.js";

// Логирование
import logger from "#utils/logs.js";

// Контроллер "Получаем тариф"
export async function getTariff(id) {
    try {
        // Подключаемся к базе
        await connectToDatabase();
        // Получаем тариф
        const tariff = await Tariff.findById(id);
        // Проверяем данные
        if (!tariff) { return null };
        // Отправляем данные
        return tariff;
    } catch (e) {
        logger.error('Ошибка получения тарифа:', e);
    }
};

// Контроллер "Получаем все тарифы"
export async function getTariffs() {
    try {
        // Подключаемся к базе
        await connectToDatabase();
        // Получаем тариф
        const tariffs = await Tariff.find();
        // Проверяем данные
        if (!tariffs) { return null };
        // Отправляем данные
        return tariffs;
    } catch (e) {
        logger.error('Ошибка получения тарифов:', e);
    }
};

// Контроллер "Получаем тариф по amount"
export async function getTariffByAmount(amount) {
    try {
        // Подключаемся к базе
        await connectToDatabase();
        // Получаем тариф
        const tariff = await Tariff.findOne({ amount: amount });
        // Проверяем данные
        if (!tariff) { return null };
        // Отправляем данные
        return tariff;
    } catch (e) {
        logger.error('Ошибка получения тарифа:', e);
    }
};