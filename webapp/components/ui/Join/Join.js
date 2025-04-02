// Импорт стилей
import "@/components/ui/Join/Join.modules.css";

// Импорт компонентов
import Header from "@/components/ui/Header/Header";
import Button from "@/components/ui/Button/Button";
import Icon from "@/components/ui/Icon/Icon";

// Компонент
export default function Join({ title, description, date, promotion }) {
    return (
        <div className='join'>
            <Header title={`Акция #${promotion.title_id}`} description={promotion._id} />
            <div className='join-content'>
                <Icon name="CheckIcon" className="join-icon" />
                <div className='join-title'>{title}</div>
                <div className='join-badge'>Итоги: {date}</div>
                <div className='join-description'>{description}</div>
            </div>
            <Button name="Закрыть приложение" icon="XCircleIcon" event={() => Telegram.WebApp.close()} />
        </div>
    )
}