"use client"

// Импорт компонентов
import { useState, useEffect } from "react";
import { getPromotion, updatePromotion } from "@/controllers/Promotions";
import { checkAdmin } from "@/controllers/Auth";
import Page from "@/components/ui/Page/Page";
import Header from "@/components/ui/Header/Header";
import Form from "@/components/ui/Form/Form";
import fields from "@/data/fields/Promotion.json";
import Preloader from "@/components/ui/Preloader/Preloader";
import Error from "@/components/ui/Error/Error";

// Компонент
export default function Edit({ id }) {
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
            // Получаем данные раздачи
            const { response, error } = await getPromotion(id);
            if (error) {
                setError(error);
                setIsLoading(true);
                return;
            };
            // Записываем данные
            setFormData(response)
            // Установка состояния загрузки
            setIsLoading(true)
        }
        // Запуск функции
        isAdmin();
    }, [id]);

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
            <Header title="Редактирование" description={`ID: ${formData.title_id}`} />
            <Form onSubmit={updatePromotion} fields={fields} formData={formData} setFormData={setFormData} buttonName="Редактировать" buttonIcon="PencilSquareIcon" />
        </Page>
    );
}