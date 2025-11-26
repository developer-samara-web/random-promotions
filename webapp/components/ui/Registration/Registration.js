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
			<Header title="Регистрация" description="Правила использования бота:" />
			<Block className="text-center">
				Перед началом использования бота, пожалуйста, ознакомьтесь с нашими правилами:
			</Block>

			<Block>
				<div className="font-medium">1. Наши офф каналы:</div>
				<div className="flex flex-col gap-1 list-none font-light mt-2">
					<li>Бесплатные раздачи @Majestic_Ryletka</li>
					<li>Наш бот @ryletka_garsem_bot</li>
					<li>Так же есть Приватный канал, в котором самые вкусные раздачи, но доступ туда можно получить через @ryletka_garsem_bot</li>
					<li>Пруфы всех выплат @pryfi_garsem</li>
				</div>
			</Block>

			<Block>
				<div className="font-medium">2. Все выплаты производятся ПО ЧЕТВЕРГАМ!</div>
			</Block>

			<Block>
				<div className="font-medium">3. Определение победителей:</div>
				<div className="flex flex-col gap-1 list-none font-light mt-2">
					<li>3.1. Победитель выбирается рандомно через нашего бота.</li>
					<li>3.2. Результаты публикуются в группе и дублируются в ЛС нашим ботом  @ryletka_garsem_bot.</li>
					<li>3.3. Если победитель не отписал на контакты @gar_sem в течении 3-х дней - разыгрываем приз повторно!</li>
				</div>
			</Block>

			<Block>
				<div className="font-medium">4. По любым вопросам обращаться к @gar_sem</div>
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