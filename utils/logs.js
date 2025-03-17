// Импорты
import { createLogger, transports, format } from 'winston';

// Логирование
export default createLogger({
    level: 'info',
    format: format.combine(
        format.colorize(),
        format.timestamp({ format: () => new Date().toLocaleString("ru-RU", { timeZone: "Europe/Moscow" }) }),
        format.errors({ stack: true }),
        format.printf(({ timestamp, level, message, stack }) => {
            return `[${timestamp}] ${level}: ${message}${stack ? `\n${stack}` : ''}`;
        })
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'logs/error.log', level: 'error' }),
        new transports.File({ filename: 'logs/warn.log', level: 'warn' }),
        new transports.File({ filename: 'logs/info.log', level: 'info' }),
        new transports.File({ filename: 'logs/combined.log' })
    ],
});