"use client"

// Импорт компонентов
import { useState, useEffect } from "react";
import { getPromotion, updatePromotion } from "@/controllers/Promotions";
import Page from "@/components/ui/Page/Page";
import Header from "@/components/ui/Header/Header";
import Form from "@/components/ui/Form/Form";
import fields from "@/data/fields/Promotion.json";

// Компонент
export default function Edit({ id }) {
    const [formData, setFormData] = useState({});

    // Получаем акцию
    useEffect(() => {
        const fetchPromotion = async () => {
            const { response, error } = await getPromotion(id);
            // Если ошибка
            if (error) return;
            // Записываем данные
            setFormData(response)
        }
        // Запускаем
        fetchPromotion()
    }, [])

    return (
        <Page>
            <Header title="Редактирование акции" description={`ID: ${id}`} />
            <Form onSubmit={updatePromotion} fields={fields} formData={formData} setFormData={setFormData} buttonName="Редактировать" buttonIcon="PencilSquareIcon" />
        </Page>
    );
}