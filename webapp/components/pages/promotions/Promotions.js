"use client"

// Импорт компонентов
import { useState, useEffect } from "react";
import { checkAdmin } from "@/controllers/Users";
import Page from "@/components/ui/Page/Page";
import Header from "@/components/ui/Header/Header";
import Preloader from "@/components/ui/Preloader/Preloader";
import Error from "@/components/ui/Error/Error";
import List from "@/components/ui/List/List";

// Компонент
export default function Promotions() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Получаем акцию
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
            <Header title="Список всех акций" />
            <List/>
        </Page>
    );
}