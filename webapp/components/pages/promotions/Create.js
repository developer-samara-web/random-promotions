"use client"

// Импорт компонентов
import { useState } from 'react';
import { setPromotion } from "@/controllers/Promotions";
import Page from "@/components/ui/Page/Page";
import Header from "@/components/ui/Header/Header";
import Form from "@/components/ui/Form/Form";
import fields from "@/data/fields/Promotion.json";

// Компонент
export default function Create() {
    const [formData, setFormData] = useState({ subscribe: false });
    return (
        <Page>
            <Header title="Создание акции" />
            <Form onSubmit={setPromotion} fields={fields} formData={formData} setFormData={setFormData} buttonName="Создать акцию" buttonIcon="CheckCircleIcon" />
        </Page>
    );
}