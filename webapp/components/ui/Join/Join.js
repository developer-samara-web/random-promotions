// Импорт стилей
import "@/components/ui/Join/Join.modules.css";

// Импорт компонентов
import Header from "@/components/ui/Header/Header";
import Button from "@/components/ui/Button/Button";
import Image from "next/image";

// Компонент
export default function Join({ title, description, date, promotion, image }) {
    return (
        <div className='join'>
            <Header title={promotion.title} description={promotion._id} />
            <div className='join-content'>
                <Image className="join-image" src={image} width={150} height={150} alt="team" />
                <div className='join-title'>{title}</div>
                {date && <div className='join-badge'>Итоги: {date}</div>}
                <div className='join-description'>{description}</div>
            </div>
            <Button name="Закрыть приложение" icon="XCircleIcon" className="text-yellow-900 !bg-yellow-400" event={() => Telegram.WebApp.close()} />
        </div>
    )
}