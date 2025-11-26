// Импорт стилей
import "@/components/ui/Profile/Profile.modules.css";

// Импорт компонентов
import Page from "@/components/ui/Page/Page";
import Participant from "@/components/ui/Participant/Participant";
import Error from "@/components/ui/Error/Error";
import Button from "@/components/ui/Button/Button";

// Компонент
export default function Profile({ username, participants }) {
	return (
		<Page>
			<section className='profile'>
				<div className='profile-welcome'>Привет, {username}!</div>
				<div className='profile-content'>
					{participants.length ? <div className='profile-history'>История участий:</div> : null}
					<div className='profile-items'>
						{participants && participants.map(({ _id, promotion_id, status }) => (
							<Participant key={_id} promotion={promotion_id} status={status} />
						))}
						{!participants.length && <Error title="Список участий пуст" description="Извините, но по данным нашей системы у вас нет участий в раздачах, поэтому информация отсутствует." />}
					</div>
				</div>
				<div className='profile-button'>
					<Button name="Закрыть приложение" icon="XCircleIcon" className="text-yellow-900 !bg-yellow-400" event={() => Telegram.WebApp.close()} />
				</div>
			</section>
		</Page>
	)
}