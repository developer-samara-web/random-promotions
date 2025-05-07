"use client";

import { useState, useEffect } from "react";
import { getUser } from "@/controllers/Users";
import { getTariff } from "@/controllers/Tariffs";
import { getTransaction } from "@/controllers/Transactions";
import Preloader from "@/components/ui/Preloader/Preloader";
import Button from "@/components/ui/Button/Button";
import Success from "@/components/ui/Success/Success";
import Error from "@/components/ui/Error/Error";
import Page from "@/components/ui/Page/Page";
import Image from "next/image";
import Header from "@/components/ui/Header/Header";

// Компонент Payment
export default function Payment({ transactionId }) {
    const [isLoading, setIsLoading] = useState(true);
    const [transaction, setTransactionData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!transactionId) return;

        const fetchData = async () => {
            try {
                // Создаём новую транзакцию
                const { response: transactionData } = await getTransaction(transactionId);
                setTransactionData(transactionData);
            } catch (e) {
                console.error("Ошибка при загрузке данных или оплате:", e);
                setError(e.message);
            } finally {
                setIsLoading(false)
            }
        };

        fetchData();
    }, [transactionId]);

    // Загрузка
    if (isLoading) {
        return (
            <Page>
                <Preloader title="Проверяю данные тарифов" />
            </Page>
        );
    }

    // При оплате с ошибкой
    return (
        <Page>
            {transaction.status === 'completed' ? (
                <div className="flex flex-col gap-5 justify-between w-full">
                    <Header title="🎉 Успешная транзакция" description={`ID: ${transaction._id}`} />
                    <div className="flex flex-col gap-5 items-center w-full">
                        <Image src="/cheerful.png" width="170" height="170" alt="payment-check" />
                        <Success title="🎉 Успешная транзакция" description="Средства успешно зачислены, и теперь вы можете пользоваться всеми возможностями сервиса." />
                    </div>
                    <Button name="Вернуться в канал" icon="ArrowLeftCircleIcon" link={process.env.NEXT_PUBLIC_TELEGRAM_BOT_URL} />
                </div>
            ) : transaction.status === 'in_progress' ? (
                <>
                    <Header title="🚫 Ожидаем оплату" description={`ID: ${transaction._id}`} />
                    <Image src="/pleased.png" width="170" height="170" alt="no-credit-card" />
                    <Success title="Платёж в обработке" description="Мы получили ваш платёж и сейчас проверяем его. Обычно это занимает от 1 до 5 минут. Как только обработка завершится, вы получите подтверждение." />
                    <div className="w-full flex flex-col gap-3">
                        <Button name="Вернуться в канал" icon="ArrowLeftCircleIcon" link={process.env.NEXT_PUBLIC_TELEGRAM_BOT_URL} />
                    </div>
                </>
            ) : (
                <>
                    <Header title="🚫 Ошибка оплаты" description={`ID: ${transaction._id}`} />
                    <Image src="/sad.png" width="170" height="170" alt="no-credit-card" />
                    <Error title="Ошибка оплаты" description="Мы уже получили уведомление о проблеме и делаем всё возможное, чтобы решить её как можно скорее. Если ошибка повторится, обратитесь в нашу службу поддержки." />
                    <div className="w-full flex flex-col gap-3">
                        <Button name="Вернуться в канал" icon="ArrowLeftCircleIcon" link={process.env.NEXT_PUBLIC_TELEGRAM_BOT_URL} />
                    </div>
                </>
            )}
        </Page>
    )
}