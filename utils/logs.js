// Импорты
import { createLogger, transports, format } from 'winston';
import TelegramLogger from 'winston-telegram';

// Логирование
export default createLogger({
    level: 'info',
    format: format.combine(
        // format.colorize(),
        format.timestamp({ format: () => new Date().toLocaleString("ru-RU", { timeZone: "Europe/Moscow" }) }),
        format.errors({ stack: true }),
        format.printf(({ timestamp, level, message, stack }) => {
            return `[${timestamp}] ${level}: ${message}${stack ? `\n${stack}` : ''}`;
        })
    ),
    transports: [
        new transports.Console(),
        new TelegramLogger({
            token: process.env.TELEGRAM_TOKEN,
            chatId: process.env.TELEGRAM_LOG_GROUP_ID,
            level: process.env.TELEGRAM_LOG_LAVEL, // теперь будет отправлять всё от info и выше
            unique: false,
            handleExceptions: true,
            format: format.combine(
                format.timestamp({ format: () => new Date().toLocaleString("ru-RU") }),
                format.printf(({ level, message, stack }) => {
                    return `[${new Date().toLocaleString("ru-RU")}] ${level.toUpperCase()}:\n${message}${stack ? `\n<code>${stack}</code>` : ''}`;
                })
            ),
        }),
        new transports.File({ filename: 'logs/error.log', level: 'error' }),
        new transports.File({ filename: 'logs/warn.log', level: 'warn' }),
        new transports.File({ filename: 'logs/info.log', level: 'info' }),
        new transports.File({ filename: 'logs/combined.log' }),
    ],
});