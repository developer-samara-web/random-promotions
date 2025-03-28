"use client"

// Импорт компонентов
import { useEffect, useState } from 'react';
import { participantMiddleware } from "@/middlewares/participantMiddleware";
import { setParticipant } from "@/controllers/Participant";
import Page from "@/components/ui/Page/Page";
import Header from "@/components/ui/Header/Header";
import Promotion from "@/components/ui/Promotion/Promotion";
import Block from "@/components/ui/Block/Block";
import Preloader from '@/components/ui/Preloader/Preloader';
import Success from "@/components/ui/Success/Success";
import Error from "@/components/ui/Error/Error";
import Button from "@/components/ui/Button/Button";
import Image from "next/image"

// Компонент
export default function Home() {
    const [isLoading, setIsLoading] = useState(true);
    const [promotion, setPromotion] = useState(null);
    const [user, setUser] = useState(null);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (window.Telegram && Telegram.WebApp) {
                    // Получаем данные акции и пользователя
                    const telegram_id = Telegram.WebApp.initDataUnsafe.user?.id;
                    const promotion_id = Telegram.WebApp.initDataUnsafe?.start_param;
                    // Проверяем все условия
                    const { doubble, access, error } = await participantMiddleware(telegram_id, promotion_id, setPromotion, setUser, setSuccess);
                    // Если ошибка возвращаем её
                    if (error) { throw { ...error } }
                    // Устанавливаем данные
                    setUser(access.user.response)
                    setPromotion(access.promotion.response)

                    if (doubble) {
                        setSuccess(true); return;
                    }
                }
            } catch (e) {
                setError(e);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // Если загрузка данных
    if (isLoading) {
        return (
            <Page>
                <Preloader />
            </Page>
        );
    }

    // Если есть ошибка
    if (error) {
        return (
            <Page>
                <Error title="Произошла ошибка" description={error.message} />
                {error.buttons && <Button link={error.buttons.url} name={error.buttons.name} icon={error.buttons.icon} />}
            </Page>
        );
    }

    // При удачном участии
    if (success) {
        return (
            <Page>
                <Header title={`Раздача #${promotion.title_id}`} />
                <Success title="✅ Вы участвуете в раздаче!" />
                <Image src="/pending.png" width={200} height={200} alt={promotion._id} />
                <Block className="flex flex-col gap-2">
                    <b>📅 Итоги будут подведены:<br></br>
                        ✅ {promotion.end_date}.</b>
                </Block>
            </Page>
        );
    }

    // Успешный рендер
    return (
        <Page>
            <Header title={`Акция #${promotion.title_id}`} />
            <Promotion title={promotion.title} description={promotion.description} image={promotion.banner_image} status={promotion.status} subscribe={promotion.requires_subscription} />
            <Button name="Принять участие" icon="CheckCircleIcon" event={() => setParticipant(promotion._id, user._id, setSuccess)} />
        </Page>
    );
}