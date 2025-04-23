// Импорты
import { NextResponse } from "next/server";
import generateMApiToken from "@/utils/generateMApiToken";

// Маршрут "Создание транзакции"
export async function POST(request) {
    try {
        // Получаем данные из запроса
        const { user, tariff, transaction } = await request.json();
        // Проверка входных данных
        if (!user || !tariff || !transaction) { return NextResponse.json({ error: 'Некорректные данные' }, { status: 400 }) }
        // Форматирование суммы
        const amount = `${tariff.recurring_amount}00`;
        // Создаём тело запроса
        const body = {
            TerminalKey: process.env.TBANK_TERMINAL_KEY,
            Amount: amount,
            OrderId: transaction._id.toString(),
            CustomerKey: user._id.toString(),
            Description: tariff.name,
            PayType: "O",
            NotificationURL: `${process.env.NEXT_PUBLIC_SERVER_URL}/notification`,
            SuccessURL: `${process.env.NEXT_PUBLIC_URL}/payment/view/${transaction._id.toString()}`,
            FailURL: `${process.env.NEXT_PUBLIC_URL}/payment/view/${transaction._id.toString()}`
        }
        // Генерация токена
        const token = generateMApiToken(body, process.env.TBANK_TERMINAL_PASSWORD);
        // Отправка запроса                         
        const response = await fetch(`${process.env.TBANK_API_URL}/Init`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({
                ...body,
                DATA: {
                    Phone: '+71234567890',
                    Email: 'example@mail.ru'
                },
                Receipt: {
                    Email: "example@mail.ru",
                    Phone: "+71234567890",
                    Taxation: "osn",
                    Items: [
                        { Name: tariff.name, Price: amount, Quantity: 1, Amount: amount, Tax: "none" }
                    ]
                },
                Token: token
            })
        });
        // отправляем ответ от сервера
        const { Success, PaymentURL } = await response.json();
        return NextResponse.json({ Success, PaymentURL }, { status: 200 });
    } catch (e) {
        console.error('Общая ошибка:', e);
        return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
    }
}