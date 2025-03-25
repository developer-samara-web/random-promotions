"use client"

// Импорт компонентов
import { useEffect, useState } from 'react';
import { getPromotion } from "@/controllers/Promotions";
import { getUser } from "@/controllers/Users";
import { setUserToPromotion } from "@/controllers/Users";
import checkLimit  from "@/utils/checkLimit";
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
export default function Home({ searchParams }) {
    const [isLoading, setIsLoading] = useState(true);
    const [promotion, setPromotion] = useState(null);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    // Получаем id акции и пользователя
    const { promotion_id, telegram_id } = searchParams;

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Проверка полученных данных
                if (!promotion_id || !telegram_id) {
                    throw { message: 'Ошибка получения данных. Если проблема повторяется, пожалуйста, свяжитесь с нашей технической поддержкой для уточнения причин.' };
                }

                // Получаем данные пользователя
                const fetchedUser = await getUser(telegram_id);
                if (fetchedUser.error) {
                    throw new Error(fetchedUser.error);
                }

                // Получаем данные акции
                const fetchedPromotion = await getPromotion(promotion_id);
                if (fetchedPromotion.error) {
                    throw { message: 'Ошибка получения данных акции. Если проблема повторяется, пожалуйста, свяжитесь с нашей технической поддержкой для уточнения причин.' };
                }
                setPromotion(fetchedPromotion.response);

                // Проверка активности акции
                if (!fetchedPromotion.response.is_published) {
                    throw { message: 'Акция в данный момент не активна. Если проблема повторяется, пожалуйста, свяжитесь с нашей технической поддержкой для уточнения причин.' };
                }

                // Проверка условий
                if (fetchedPromotion.response.subscribe && !fetchedUser.response.is_subscription) {
                    throw {
                        message: 'Упс! Кажется у вас не активирована ⭐️ Премиум подписка! \nДанная Раздача доступна только для ⭐️ премиум подписчиков нашего канала. 🤩Прямо сейчас вы можете оформить подписку всего за 1 рубль!',
                        buttons: { name: 'Оформить подписку', url: process.env.NEXT_PUBLIC_TELEGRAM_BOT_URL, icon: 'ArrowRightCircleIcon' }
                    };
                }

                if (!fetchedUser.response.subscribe_channel) {
                    throw {
                        message: '🚀 Хотите выиграть приз? Сначала подпишитесь на канал! Только подписчики получают уведомления о розыгрышах — не пропустите свой шанс!',
                        buttons: { name: 'Подписаться', url: process.env.NEXT_PUBLIC_TELEGRAM_CHANEL_URL, icon: 'ArrowRightCircleIcon' }
                    };
                }

                if (checkLimit(fetchedUser.response) >= fetchedUser.response.free_limit && !fetchedUser.response.is_subscription) {
                    throw {
                        message: 'Упс! Пользователям с обычным статусом доступно всего 2 участия в Раздачах в месяц. Чтобы увеличить лимит и получить доступ ко всему функционалу канала - вам нужно быть ⭐️ Премиум подписком! 🤩Прямо сейчас вы можете оформить подписку всего за 1 рубль!',
                        buttons: { name: 'Оформить подписку', url: process.env.NEXT_PUBLIC_TELEGRAM_BOT_URL, icon: 'ArrowRightCircleIcon' }
                    };
                }

                if (fetchedPromotion.response.participants.find(item => item.user === fetchedUser.response._id)) {
                    setSuccess(`Регистрация в Раздаче прошла успешно. Результаты будут ${fetchedPromotion.response.end_time} Теперь только ждать...`);
                }
            } catch (err) {
                setError(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [telegram_id, promotion_id]);

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
                <Header title={`Раздача #${promotion._id}`} />
                <Success title="✅ Вы участвуете в раздаче!" />
                <Image src="/pending.png" width={200} height={200} alt={promotion._id} />
                <Block className="flex flex-col gap-2">
                    <b>📅 Итоги будут подведены:<br></br>
                        ✅ {promotion.end_time}.</b>
                </Block>
            </Page>
        );
    }

    // Успешный рендер
    return (
        <Page>
            <Header title={`Акция #${promotion._id}`} />
            <Promotion name={promotion.name} description={promotion.description} image={promotion.image} status={promotion.is_published} subscribe={promotion.subscribe} />
            <Button name="Принять участие" icon="CheckCircleIcon" event={() => setUserToPromotion(telegram_id, promotion_id, setSuccess, promotion.end_time)} />
        </Page>
    );
}