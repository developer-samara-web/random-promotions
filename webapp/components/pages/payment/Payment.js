"use client";

import { useState, useEffect } from "react";
import { getUser } from "@/controllers/Users";
import { getTariff } from "@/controllers/Tariffs";
import { setTransaction, getTransactions, delTransaction } from "@/controllers/Transactions";
import Preloader from "@/components/ui/Preloader/Preloader";
import Success from "@/components/ui/Success/Success";
import Error from "@/components/ui/Error/Error";
import CloudPayments from "@/services/CloudPayments";
import Page from "@/components/ui/Page/Page";

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
                const { user } = Telegram.WebApp.initDataUnsafe || {};
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
                <Error title="Ошибка оплаты" description={error.message} />
            </Page>
        );
    }

    // При успешной оплате
    if (success) {
        return (
            <Page>
                <Success title="Успешная оплата" description={success.message} />
                {success.body}
            </Page>
        );
    }

    // 
    // return (
    //     <Page>
    //         Payment {tariff ? `для тарифа ${tariff.name}` : "загружается..."}
    //         <Button name="Оплатить" event={() => CloudPayments(user, tariff, transaction)} />
    //     </Page>
    // );
}