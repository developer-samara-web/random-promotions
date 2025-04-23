"use client";

// Импорт компонентов
import { useState, useEffect } from "react";
import { initPayment } from "@/controllers/Payments";
import { getUser } from "@/controllers/Users";
import { getTariff } from "@/controllers/Tariffs";
import { setTransaction } from "@/controllers/Transactions";
import { useRouter } from 'next/navigation';
import Preloader from "@/components/ui/Preloader/Preloader";
import Button from "@/components/ui/Button/Button";
import Error from "@/components/ui/Error/Error";
import Page from "@/components/ui/Page/Page";
import Image from "next/image";
import Header from "@/components/ui/Header/Header";

// Компонент Payment
export default function Payment({ tariffId, userId }) {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        if (!tariffId || !userId) return;

        const fetchData = async () => {
            try {
                // Получаем данные пользователя
                const { response: userData } = await getUser(userId);
                // Получаем данные тарифа
                const { response: tariffData } = await getTariff(tariffId);
                // Создаём новую транзакцию
                const { response: transactionData } = await setTransaction({ user_id: userData._id, tariff_id: tariffData._id });
                // Инициализируем платеж
                const { Success, PaymentURL } = await initPayment(userData, tariffData, transactionData);
                // Редирект на страницу оплаты
                if (Success) { router.push(PaymentURL) }
            } catch (e) {
                console.error("Ошибка при загрузке данных или оплате:", e);
                setError(e.message);
            } finally {
                setIsLoading(false)
            }
        };

        fetchData();
    }, [tariffId, userId, router]);

    // Загрузка
    return (
        <Page>
            <Preloader title="Проверяю данные тарифов" />
        </Page>
    );
}