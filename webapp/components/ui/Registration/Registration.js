// Импорт компонентов
import { setUser } from "@/controllers/Users";
import Header from "@/components/ui/Header/Header";
import Button from "@/components/ui/Button/Button";
import Page from "@/components/ui/Page/Page";
import Block from "@/components/ui/Block/Block";

// Регистрация
const setUserHandler = async (user) => {
    const userData = await setUser(user);
    if (!userData) return;
    return window.location.reload();
}

// Компонент
export default function Registration() {
    return (
        <Page>
            <Header title="Регистрация" description="Правила использования сервиса:" />
            <Block>
                <div className="font-medium">🎁 Основные условия:</div>
                <li className="flex flex-col gap-1 list-none font-light mt-2">Участие — бесплатное (если не указано иное)</li>
            </Block>

            <Block>
                <div className="font-medium">⚠️ Для входа в розыгрыш нужно:</div>
                <div className="flex flex-col gap-1 list-none font-light mt-2">
                    <li>1. Быть подписанным на наш канал.</li>
                    <li>2. Нажать кнопку «Участвовать» под постом с розыгрышем.</li>
                    <li>3. Выполнить дополнительные условия (если есть): репост, отметка друга и т.д.</li>
                </div>
            </Block>

            <Block>
                <div className="font-medium">⚠️ Ограничения</div>
                <div className="flex flex-col gap-1 list-none font-light mt-2">
                    <li> 1 участник = 1 заявка (дубли удаляются)</li>
                    <li>Фейковые аккаунты и боты дисквалифицируются</li>
                    <li>Подписка должна быть активна до момента выбора победителя</li>
                </div>
            </Block>

            <Block>
                <div className="font-medium">🏆 Определение победителей.</div>
                <div className="flex flex-col gap-1 list-none font-light mt-2">
                    <li>1. Победитель выбирается рандомно через нашего бота.</li>
                    <li>2. Результаты публикуются в группе и дублируются в ЛС.</li>
                    <li>3. Если победитель не отписал менеджеру @manager_razdachkin в течении 3 дней — разыгрываем приз повторно!</li>
                </div>
            </Block>

            <Block>
                <div className="font-medium">🎁 Условия по призам.</div>
                <div className="flex flex-col gap-1 list-none font-light mt-2">
                    <li>1. Товары можем доставить только в те страны, где есть ПВЗ Wildberries , Ozon, Яндекс Маркет, СДЕК.</li>
                    <li>2. В случае выигрыша - вам нужно самостоятельно написать нашему менеджеру @manager_razdachkin</li>
                    <li>3. Сроки доставки от нас не зависят. Мы предоставим вам все данные для отслеживания посылок!</li>
                </div>
            </Block>

            <div className="sticky bottom-0 left-0 w-full flex bg-gradient-to-b from-transparent to-slate-900 items-center justify-center pt-5">
                <div className="flex flex-col mb-5 max-w-[450px] w-full gap-3">
                    <Button className="!bg-[#429f3c]" name="Принять и зарегистрироваться" icon="CheckBadgeIcon" event={() => setUserHandler(Telegram.WebApp.initDataUnsafe.user)} />
                    <div className="text-xs text-slate-400 text-center">Нажимая кнопку “Принять и зарегистрироваться”, вы подтверждаете, что ознакомились с правилами и соглашаетесь с ними.</div>
                </div>
            </div>
        </Page>
    )
}