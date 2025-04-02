// Импорт стилей
import "@/components/ui/Profile/Profile.modules.css";

// Импорт компонентов
import Participant from "@/components/ui/Participant/Participant";
import Button from "@/components/ui/Button/Button";

// Компонент
export default function Profile({ username, participants }) {
    return (
        <section className='profile'>
            <div className='profile-welcome'>Привет, {username}!</div>
            <div className='profile-content'>
                <div className='profile-history'>История участий:</div>
                <div className='profile-items'>
                    {participants && participants.map(({ _id, promotion_id, status }) => (
                        <Participant key={_id} promotion={promotion_id} status={status} />
                    ))}
                </div>
            </div>
            <div className='profile-button'>
                <Button name="Закрыть приложение" icon="XCircleIcon" event={() => Telegram.WebApp.close()} />
            </div>
        </section>
    )
}