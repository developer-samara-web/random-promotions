"use client"

// Импорт компонентов
import { useEffect, useState } from 'react';
import { getPromotion } from "@/controllers/Promotions";
import Page from "@/components/ui/Page/Page";
import Header from "@/components/ui/Header/Header";
import Promotion from "@/components/ui/Promotion/Promotion";
import Conditions from "@/components/ui/Conditions/Conditions";
import Error from "@/components/ui/Error/Error";
import Button from "@/components/ui/Button/Button";

// Компонент
export default function Home({ searchParams }) {
    const [promotion, setPromotion] = useState({});

    // Получаем id акции
    const { promotion_id, user_id } = searchParams;

    // Получаем акцию
    useEffect(() => {
        const fetchPromotion = async () => {
            const { response, error } = await getPromotion(promotion_id);
            // Если ошибка
            if (error) return;
            // Записываем данные
            setPromotion(response)
        }
        // Запускаем
        fetchPromotion()
    }, [])

    if (!promotion._id) {
        return (
            <Page>
                <Error title="Произошла ошибка" description="Не удалось найти акцию или её не существует." />
            </Page>
        );
    }

    if (!promotion.is_published) {
        return (
            <Page>
                <Error title="Произошла ошибка" description="В данный момент акция недоступна." />
            </Page>
        );
    }

    return (
        <Page>
            <Header title={`Раздача № ${promotion_id}`} description={`ID: ${promotion_id}`} />
            <Promotion name={promotion.name} description={promotion.description} />
            <Conditions user={user_id} />
            <Button name="Принять участие" icon="CheckCircleIcon" />
        </Page>
    );
}