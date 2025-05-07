"use client";

import { useState, useEffect } from "react";
import { getUser } from "@/controllers/Users";
import { getTariff } from "@/controllers/Tariffs";
import { setTransaction } from "@/controllers/Transactions";
import formatDate from "@/utils/formatDate";
import Preloader from "@/components/ui/Preloader/Preloader";
import Button from "@/components/ui/Button/Button";
import Success from "@/components/ui/Success/Success";
import Error from "@/components/ui/Error/Error";
import CloudPayments from "@/services/CloudPayments";
import Page from "@/components/ui/Page/Page";
import Image from "next/image";
import Header from "@/components/ui/Header/Header";

// Компонент Payment
export default function Payment({ tariffId }) {
    const [isLoading, setIsLoading] = useState(true);
    const [transaction, setTransactionData] = useState(null);
    const [user, setUser] = useState(null);
    const [tariff, setTariff] = useState(null);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!tariffId) return;

        const fetchData = async () => {
            try {
                // Получаем данные пользователя
                const { user } = Telegram.WebApp.initDataUnsafe || {};
                // Если пользователь не найден
                if (!user || !user.id) { throw new Error("Пользователь не найден") };
                // Получаем данные пользователя
                const { response: userData } = await getUser(user.id);
                setUser(userData);
                // Получаем данные тарифа
                const { response: tariffData } = await getTariff(tariffId);
                setTariff(tariffData);
                // Создаём новую транзакцию
                const { response: transactionData } = await setTransaction({ user_id: userData._id, tariff_id: tariffData._id });
                setTransactionData(transactionData);
                // Открываем оплату
                CloudPayments(userData, tariffData, transactionData, setError, setSuccess);
            } catch (e) {
                console.error("Ошибка при загрузке данных или оплате:", e);
                setError(e.message);
            } finally {
                setIsLoading(false)
            }
        };

        fetchData();
    }, [tariffId]);

    // Загрузка
    if (isLoading) {
        return (
            <Page>
                <Preloader title="Проверяю данные тарифов" />
            </Page>
        );
    }

    // При оплате с ошибкой
    if (error) {
        return (
            <Page>
                <Header title="🚫 Ошибка транзакции" description={`ID: ${transaction._id}`} />
                <Image src="/sad.png" width="170" height="170" alt="no-credit-card" />
                <Error title="Ошибка оплаты" description="Мы уже получили уведомление о проблеме и делаем всё возможное, чтобы решить её как можно скорее. Если ошибка повторится, обратитесь в нашу службу поддержки." />
                <div className="w-full flex flex-col gap-3">
                    <Button name="Повторить попытку" icon="ArrowPathIcon" event={() => window.location.reload()} />
                    <Button name="Закрыть приложение" icon="XCircleIcon" className="text-yellow-900 !bg-yellow-400" event={() => Telegram.WebApp.close()} />
                </div>
            </Page>
        );
    }

    // При успешной оплате
    if (success) {
        return (
            <Page>
                <div className="flex flex-col gap-5 justify-between w-full">
                    <Header title="🎉 Успешная транзакция" description={`ID: ${transaction._id}`} />
                    <div className="flex flex-col gap-5 items-center w-full">
                        <Image src="/cheerful.png" width="170" height="170" alt="payment-check" />
                        <Success title="🎉 Успешная транзакция" description="Средства успешно зачислены, и теперь вы можете пользоваться всеми возможностями сервиса." />
                    </div>
                    <Button name="Закрыть приложение" icon="XCircleIcon" className="text-yellow-900 !bg-yellow-400" event={() => Telegram.WebApp.close()} />
                </div>
            </Page>
        );
    }
}