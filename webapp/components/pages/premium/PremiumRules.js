"use client"

// Импорт компонентов
import { useState, useEffect } from "react";
import { getTariff } from "@/controllers/Tariffs";
import Preloader from "@/components/ui/Preloader/Preloader";
import Page from "@/components/ui/Page/Page";
import Block from "@/components/ui/Block/Block";
import Button from "@/components/ui/Button/Button";
import Header from "@/components/ui/Header/Header";

export default function PremiumRules({ tariffId }) {
    const [spoiler, setSpoiler] = useState(false);
    const [tariff, setTariff] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Получаем все тарифы
    useEffect(() => {
        const fetchTariffs = async () => {
            const { response: tariffs } = await getTariff(tariffId);

            setTariff(tariffs)
            // Установка состояния загрузки
            setIsLoading(true)
        }
        // Запуск функции
        fetchTariffs();
    }, [])

    // Загрузка данных
    if (!isLoading) {
        return (
            <Page>
                <Preloader />
            </Page>
        )
    }

    return (
        <Page>
            <Header title="Премиум подписка" />
            <Block className="gap-3">
                <h2 className="font-medium">⚠️ Условия оказания услуг:</h2>
                <div className="text-sm mt-2">Осуществляя оплату, <b>Вы подтверждаете ознакомление со всеми текущими тарифами сервиса</b>, а также даете согласие на дальнейшую пролонгацию платежей.</div>
                <div className="text-sm mt-2">{tariff.rules}</div>
            </Block>
            <div className="flex flex-col gap-3 w-full">
                <Button name="Я согласен(-а)" icon="CheckCircleIcon" link={`/payment/${tariff._id}`} />
                <Button name="Вернуться" icon="ArrowLeftCircleIcon" className="text-yellow-900 !bg-yellow-400" link={`/premium`} />
            </div>
        </Page>
    )
}