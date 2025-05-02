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
            <Header title="Управление тарифами" description="Список тарифов" />
            <List items={tariffs} search={false} button="test" />
            <div className="sticky bottom-0 left-0 w-full flex bg-gradient-to-b from-transparent to-slate-900 items-center justify-center">
                <div className="flex flex-col mb-5 max-w-[450px] w-full gap-3">
                    <Button name="Добавить новый" icon="PlusCircleIcon" link="/tariffs/create" />
                    <Button name="Закрыть приложение" icon="XCircleIcon" className="text-yellow-900 !bg-yellow-400" event={() => Telegram.WebApp.close()} />
                </div>
            </div>
        </Page>
    );
}