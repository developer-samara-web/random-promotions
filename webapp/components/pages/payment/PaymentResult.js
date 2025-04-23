"use client";

// Импорт компонентов
import { useState, useEffect } from "react";
import { getTransaction } from "@/controllers/Transactions";
import Preloader from "@/components/ui/Preloader/Preloader";
import Button from "@/components/ui/Button/Button";
import Error from "@/components/ui/Error/Error";
import Success from "@/components/ui/Success/Success";
import Page from "@/components/ui/Page/Page";
import Image from "next/image";
import Header from "@/components/ui/Header/Header";

// Компонент PaymentResult
export default function PaymentResult({ transactionId }) {
    const [transaction, setTransaction] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)

    // Получаем данные транзакции
    useEffect(() => {
        if (!transactionId) return;

        const fetchData = async () => {
            try {
                // Получаем данные пользователя
                const { response, error } = await getTransaction(transactionId);
                // Записываем в стейт
                if (!error) { setTransaction(response) }
            } catch (e) {
                console.error("Ошибка при загрузке данных транзакции:", e);
                setError(e.message);
            } finally {
                setLoading(false)
            }
        };

        fetchData();
    }, [transactionId]);

    if (loading) {
        return (
            <Page>
                <Preloader title="Проверяю данные тарифов" />
            </Page>
        );
    }

    if (error) {
        return (
            <Page>
                <Error title="Ошибка" description={error.message} />
            </Page>
        );
    }

    return (
        <Page>
            {
                transaction?.status === 'completed' ? (
                    <>
                        <Header title="🎉 Успешная транзакция" description={`ID: ${transaction._id}`} />
                        <Image src="/payment-check.png" width="120" height="120" alt="no-credit-card" />
                        <Success title="Информация" description="Мы подтвердили получение оплаты. Теперь вы сможете наслаждаться всеми преимуществами премиум подписки. Мы рады, что вы с нами!" />
                        <div className="w-full flex flex-col gap-3">
                            <Button name="Вернуться в бота" icon="XCircleIcon" className="text-yellow-900 !bg-yellow-400" event={() => window.location.href = 'tg://close'} />
                        </div>
                    </>
                ) : transaction.status === 'in_progress' ? (
                    <>
                        <Header title="⏳ Обработка платежа" description={`ID: ${transaction._id}`} />
                        <Image src="/payment-check.png" width="120" height="120" alt="no-credit-card" />
                        <Success title="Информация" description="Мы получили вашу оплату за подписку и сейчас ее обрабатываем. Пожалуйста, подождите немного. Вы получите подтверждение в нашем телеграм боте." />
                        <div className="w-full flex flex-col gap-3">
                            <Button name="Вернуться в бота" icon="XCircleIcon" className="text-yellow-900 !bg-yellow-400" event={() => Telegram.WebApp.close()} />
                        </div>
                    </>
                ) : (
                    <>
                        <Header title="🎉 Ошибка транзакции" description={`ID: ${transaction._id}`} />
                        <Image src="/no-credit-card.png" width="120" height="120" alt="no-credit-card" />
                        <Error title="Информация" description="Мы обнаружили проблему при обработке платежа. Если проблема сохраняется, свяжитесь с нашей службой поддержки. Мы постараемся помочь вам решить проблему!" />
                        <div className="w-full flex flex-col gap-3">
                            <Button name="Вернуться в бота" icon="XCircleIcon" className="text-yellow-900 !bg-yellow-400" event={() => Telegram.WebApp.close()} />
                        </div>
                    </>
                )
            }
        </Page>
    )
}