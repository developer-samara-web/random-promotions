"use client"

// Импорт компонентов
import { useFormStatus } from 'react-dom';
import Page from "@/components/ui/Page/Page";
import Header from "@/components/ui/Header/Header";
import FormQuery from "@/components/ui/Form/Form";
import fields from "@/data/fields/Promotion.json"

// Компонент
export default function Edit() {
    const status = useFormStatus();
    return (
        <Page>
            <Header title="Редактирование акции" description="ID: {id}" />
            <FormQuery action="/" fields={fields} button={status.pending ? 'Сохраняю...' : 'Сохранить'} />
        </Page>
    );
}