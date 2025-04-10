"use client"

// Импорт компонентов
import { useState, useEffect } from "react";
import { getTariffs } from "@/controllers/Tariffs";
import Preloader from "@/components/ui/Preloader/Preloader";
import Page from "@/components/ui/Page/Page";
import Block from "@/components/ui/Block/Block";
import Button from "@/components/ui/Button/Button";
import Header from "@/components/ui/Header/Header";

export default function Premium() {
    const [tariffs, setTariffs] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Получаем все тарифы
    useEffect(() => {
        const fetchTariffs = async () => {
            const { response: tariffs } = await getTariffs();

            setTariffs(tariffs)
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
            <Block>
                <h2 className="font-medium">🌟 Почему вам нужна премиум подписка на наш Телеграм канал? 🌟</h2>
                <h2 className="font-medium py-2">✨ Без премиум подписки:</h2>
                <ul className="flex flex-col gap-2 list-disc pl-6">
                    <li className="text-sm">Вы можете участвовать только в 2 раздачах без пометки ⭐️.</li>
                    <li className="text-sm">Вы не можете участвовать в Раздача для Премиум-пользователей!</li>
                </ul>
                <h2 className="font-medium py-2">✨ С премиум подпиской:</h2>
                <ul className="flex flex-col gap-2 list-disc pl-6">
                    <li className="text-sm">Уберите все ограничения! Вы можете участвовать в бесконечном количестве раздач.</li>
                    <li className="text-sm">Получите доступ к эксклюзивным премиум раздачам! 🎁</li>
                </ul>
            </Block>
            <div className="flex flex-col gap-3 w-full">
                {tariffs && tariffs.map((item) => (
                    <Button key={item._id} name={item.name} link={`/premium/rules/${item._id}`} />
                ))}
                <Button name="Вернуться" icon="ArrowLeftCircleIcon" className="text-yellow-900 !bg-yellow-400" link={`/`} />
            </div>
        </Page>
    )
}