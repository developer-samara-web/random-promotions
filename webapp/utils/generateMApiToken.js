import crypto from 'crypto';

// Генератор токенов оплаты
export default function (requestData, password) {
    const flatData = {};

    // Проходим только по полям верхнего уровня и исключаем Token, объекты и массивы
    for (const key in requestData) {
        const value = requestData[key];
        if (
            Object.prototype.hasOwnProperty.call(requestData, key) &&
            typeof value !== 'object' &&
            key !== 'Token'
        ) {
            flatData[key] = String(value);
        }
    }

    // Добавляем пароль
    flatData['Password'] = password;

    // Сортируем по ключам
    const sortedKeys = Object.keys(flatData).sort();

    // Конкатенируем значения
    const concatenated = sortedKeys.map((key) => flatData[key]).join('');

    // Хешируем строку SHA-256
    const hash = crypto.createHash('sha256').update(concatenated, 'utf8').digest('hex');

    return hash;
}