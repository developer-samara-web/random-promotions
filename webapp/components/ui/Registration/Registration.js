// Импорт компонентов
import { setUser } from "@/controllers/Users";
import Header from "@/components/ui/Header/Header";
import Button from "@/components/ui/Button/Button";
import Page from "@/components/ui/Page/Page";
import Spoiler from "@/components/ui/Spoiler/Spoiler";
import Policy from "@/components/ui/Policy/Policy";
import Oferta from "@/components/ui/Oferta/Oferta";

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
            <div className="text-center text-slate-200">Перед началом использования сервиса, пожалуйста, ознакомьтесь с нашими правилами:</div>
            <Spoiler title="Правила использования" toggle={true}>
                <Policy />
            </Spoiler>
            <Spoiler title="Публичная оферта" toggle={true}>
                <Oferta />
            </Spoiler>
            <div className="text-xs text-slate-400 text-center">Нажимая кнопку “Принять и зрегистрироваться”, вы подтверждаете, что ознакомились с правилами и соглашаетесь с ними.</div>
            <Button name="Принять и зрегистрироваться" event={() => setUserHandler(Telegram.WebApp.initDataUnsafe.user)} />
        </Page>
    )
}