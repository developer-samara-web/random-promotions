"use client"

// Импорт компонентов
import { useState, useEffect } from 'react';
import { setPromotion } from "@/controllers/Promotions";
import { checkAdmin } from "@/controllers/Users";
import Page from "@/components/ui/Page/Page";
import Preloader from "@/components/ui/Preloader/Preloader";
import Header from "@/components/ui/Header/Header";
import Form from "@/components/ui/Form/Form";
import Error from "@/components/ui/Error/Error";
import fields from "@/data/fields/Promotion.json";

// Компонент
export default function Create() {
    const [formData, setFormData] = useState({ subscribe: false });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Проверка прав на просмотр
    useEffect(() => {
        const isAdmin = async () => {
            const { isAdmin } = await checkAdmin();
            // Проверка на права на просмотр
            if (!isAdmin) {
                setError("У вас не достаточно прав для работы с этой страницей. Попробуйте повторить попытку позже или обратитесь в службу поддержки.");
                setIsLoading(true)
                return;
            }
            // Установка состояния загрузки
            setIsLoading(true)
        }
        // Запуск функции
        isAdmin();
    }, []);

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
            <Header title="Создание акции" />
            <Form onSubmit={setPromotion} fields={fields} formData={formData} setFormData={setFormData} buttonName="Создать акцию" buttonIcon="CheckCircleIcon" />
        </Page>
    );
}