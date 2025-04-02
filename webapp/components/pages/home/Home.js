"use client"

// Импорт компонентов
import { useEffect, useState } from 'react';
import { getParticipants, getParticipant, setParticipant } from "@/controllers/Participant";
import { getPromotion } from "@/controllers/Promotions";
import { getUser, getSubscribe } from "@/controllers/Users";
import Promotion from "@/components/ui/Promotion/Promotion";
import Preloader from '@/components/ui/Preloader/Preloader';
import Join from "@/components/ui/Join/Join";
import Rule from '@/components/ui/Rule/Rule';
import Page from "@/components/ui/Page/Page";
import Header from "@/components/ui/Header/Header";
import Error from "@/components/ui/Error/Error";
import Button from "@/components/ui/Button/Button";
import Profile from "@/components/ui/Profile/Profile";
import formatDate from "@/utils/formatDate";
import checkLimit from '@/utils/checkLimit';

// Компонент
export default function Home() {
    const [isLoading, setIsLoading] = useState(true);
    const [screen, setScreen] = useState(false);
    const [promotion, setPromotion] = useState(null);
    const [participants, setParticipants] = useState(null);
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [rules, setRules] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (window.Telegram && Telegram.WebApp) {
                    // Получаем данные акции и пользователя
                    const { user, start_param: promotion_id } = Telegram.WebApp.initDataUnsafe;

                    if (promotion_id) { // Показываем меню участия акции
                        // Получаем данные акции и пользователя
                        const { error: userError, response: userData } = await getUser(user.id);
                        const { error: promotionError, response: promotionData } = await getPromotion(promotion_id);
                        const { error: participantsError, response: participantsData } = await getParticipants(userData._id);

                        // Проверка получения данных
                        if (!userError || !promotionError || participantsError) {
                            setParticipants(participantsData);
                            setPromotion(promotionData);
                            setUser(userData);
                        }
                        // Проверяем лимит участий
                        const participantsMonth = checkLimit(participantsData);

                        // Проверяем все правила
                        const rules = {
                            subscribe: userData.channel_subscription ? false : true,
                            premium: promotionData.requires_subscription && !userData.subscription.is_active,
                            registration: userData ? false : true,
                            free: participantsMonth.length >= 2 && !userData.subscription.is_active ? true : false
                        }

                        // Проверяем все правила
                        const rulesStatus = Object.values(rules).every(value => value === false);

                        if (rulesStatus) {
                            setRules({ ...rules });
                            const { access } = await getParticipant(userData._id, promotionData._id);

                            if (access) {
                                await setParticipant(promotionData._id, userData._id);
                                setScreen('participant-access');
                            } else {
                                setScreen('participant');
                            }
                        } else {
                            setRules({ ...rules });
                            setScreen('rules');
                        }

                    } else { // Показываем профиль пользователя
                        // Получаем данные акции и пользователя
                        const { error: userError, response: userData } = await getUser(user.id);
                        const { error: participantsError, response: participantsData } = await getParticipants(userData._id);

                        // Проверка получения данных
                        if (!userError || !participantsError) {
                            setParticipants(participantsData);
                            setUser(userData);
                        }
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

    // Обновление правил
    const refreshRulesHandler = async (user) => {
        if (!user.channel_subscription) { await getSubscribe(user.telegram_id) }
        return window.location.reload();
    }

    // Загрузка
    if (isLoading && !screen) {
        return (
            <Page>
                <Preloader title="Проверяю данные" />
            </Page>
        );
    }

    // Ошибка
    if (error) {
        return (
            <Page>
                <Error title="Произошла ошибка" description={error.message} />
            </Page>
        );
    }

    // Экран участия
    if (!isLoading && screen === 'participant') {
        return (
            <Page>
                <Join
                    title="Вы уже участвуете"
                    description="Вы уже зарегистрированы для участия в этой акции. Повторное участие невозможно, но мы благодарим вас за интерес и желаем удачи в розыгрыше!"
                    date={formatDate(promotion.end_date)}
                    promotion={promotion}
                />
            </Page>
        );
    }

    // Экран успешного участия
    if (!isLoading && screen === 'participant-access') {
        return (
            <Page>
                <Join
                    title="Успешно!"
                    description="Поздравляем! Вы успешно зарегистрированы для участия в акции. Желаем удачи и надеемся, что вы станете одним из победителей!"
                    date={formatDate(promotion.end_date)}
                    promotion={promotion}
                />
            </Page>
        );
    }

    // Экран правил
    if (!isLoading && screen === 'rules') {
        return (
            <Page>
                <Header title={`Акция #${promotion.title_id}`} description={promotion._id} />
                <Promotion title={promotion.title} description={promotion.description} image={promotion.banner_image} status={promotion.status} subscribe={promotion.requires_subscription} />
                <div className='text-xs text-slate-400 uppercase font-medium text-center'>Правила участия:</div>
                {rules.registration && <Rule name="Регистрация" description="в системе" image="/logo.jpg" button={{ name: "Пройти", style: "!py-4 !h-2 !w-28 !text-[9px] !rounded-xl", onClick: () => Telegram.WebApp.openTelegramLink(`${process.env.NEXT_PUBLIC_TELEGRAM_BOT_URL}`) }} status={rules.registration} />}
                {rules.subscribe && <Rule name="Mr. Раздачкин" description="Подписка" image="/logo.jpg" button={{ name: "Подписаться", style: "!py-4 !h-2 !w-28 !text-[9px] !rounded-xl", onClick: () => Telegram.WebApp.openTelegramLink(`${process.env.NEXT_PUBLIC_TELEGRAM_CHANEL_URL}`) }} status={!rules.subscribe} />}
                {rules.premium && <Rule name="Premium" description="Платная подписка" icon="StarIcon" button={{ name: "Оформить", style: "!py-4 !h-2 !w-28 !text-[9px] !rounded-xl", onClick: () => Telegram.WebApp.openTelegramLink(`${process.env.NEXT_PUBLIC_TELEGRAM_BOT_URL}`) }} status={!rules.premium} />}
                {rules.free && <Rule name="Free лимит" description="Участий в раздачах" icon="ExclamationTriangleIcon" count="2" status={!rules.free} />}
                <Button name="Проверить условия" icon="ArrowPathIcon" event={() => refreshRulesHandler(user)} />
                <Button name="Закрыть приложение" icon="XCircleIcon" className="text-yellow-900 !bg-yellow-400" event={() => Telegram.WebApp.close()} />
            </Page>
        );
    }

    // Профиль пользователя
    return (
        <Page>
            <Profile username={user.username} participants={participants} />
        </Page>
    )
}