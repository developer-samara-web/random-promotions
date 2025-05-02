"use client"

// Импорт компонентов
import { useState, useEffect } from "react";
import { checkAdmin } from "@/controllers/Auth";
import { getTariffs, setTariff } from "@/controllers/Tariffs";
import fields from "@/data/fields/Tariff.json";
import Form from "@/components/ui/Form/Form";
import Preloader from "@/components/ui/Preloader/Preloader";
import Page from "@/components/ui/Page/Page";
import Header from "@/components/ui/Header/Header";
import Error from "@/components/ui/Error/Error";
import Button from "@/components/ui/Button/Button";

export default function Tariffs() {
    const [formData, setFormData] = useState('');
    const [tariffs, setTariffs] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Проверяем права администратора
    useEffect(() => {
        const isAdmin = async () => {
            const { isAdmin } = await checkAdmin();
            // Проверка на права на просмотр
            if (!isAdmin) {
                setError("У вас не достаточно прав для работы с этой страницей. Попробуйте повторить попытку позже или обратитесь в службу поддержки.");
                setIsLoading(true);
                return;
            }
            // Получаем все тарифы
            const { response: tariffs } = await getTariffs();
            setTariffs(tariffs)
            // Установка состояния загрузки
            setIsLoading(true)
        }
        // Запуск функции
        isAdmin();
    }, [])

    // Загрузка данных
    if (!isLoading) {
        return (
            <Page>
                <Preloader />
            </Page>
        )
    }

    // Если нет прав на просмотр
    if (error) {
        return (
            <Page>
                <Error title="Произошла ошибка" description={error} />
            </Page>
        )
    }

    return (
        <Page>
            <Header title="Создание тарифа" />
            <Form onSubmit={setTariff} fields={fields} formData={formData} setFormData={setFormData} Telegram={window.Telegram} buttonName="Создать акцию" buttonIcon="CheckCircleIcon" />
            <Button name="Назад" icon="XCircleIcon" className="text-yellow-900 !bg-yellow-400" link="/tariffs" />
        </Page>
    );
}