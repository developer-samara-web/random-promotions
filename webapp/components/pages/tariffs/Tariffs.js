"use client"

// Импорт компонентов
import { useState, useEffect } from "react";
import { checkAdmin } from "@/controllers/Auth";
import { getTariffs } from "@/controllers/Tariffs";
import List from "@/components/ui/List/List";
import Preloader from "@/components/ui/Preloader/Preloader";
import Page from "@/components/ui/Page/Page";
import Header from "@/components/ui/Header/Header";
import Error from "@/components/ui/Error/Error";
import Button from "@/components/ui/Button/Button";

export default function Tariffs() {
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
            <Header title="Управление тарифами" />
            <Button name="Добавить новый" icon="PlusCircleIcon" link="/tariffs/create" />
            <List name="Список тарифов:" items={tariffs} search={false} />
        </Page>
    );
}