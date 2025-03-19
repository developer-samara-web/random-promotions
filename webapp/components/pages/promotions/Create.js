"use client"

// Импорт компонентов
import { useFormStatus } from 'react-dom';
import Page from "@/components/ui/Page/Page";
import Header from "@/components/ui/Header/Header";
import FormQuery from "@/components/ui/Form/Form";
import fields from "@/data/fields/Promotion.json";
import onSubmit from "@/actions/createPromotion"

// Компонент
export default function Create() {
    const status = useFormStatus();
    return (
        <Page>
            <Header title="Создание акции" />
            <FormQuery action={onSubmit} fields={fields} button={status.pending ? 'Создаю...' : 'Создать'} />
        </Page>
    );
}