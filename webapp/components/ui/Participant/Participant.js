// Импорт стилей
import "@/components/ui/Participant/Participant.modules.css";

// Импорт компонентов
import Image from "next/image";
import formatDate from "@/utils/formatDate";

// Компонент
export default function Participant({ promotion, status }) {
    return (
        <div onClick={() => Telegram.WebApp.openTelegramLink(`${process.env.NEXT_PUBLIC_TELEGRAM_CHANNEL_URL}/${promotion.message_id}`)} className={`participant-item ${status === 'winner' ? 'participant-winner' : status === 'loser' ? 'participant-loser' : 'participant-other'}`}>
            <div className='participant-content'>
                <Image className='participant-image' src={promotion.image} width={200} height={200} alt={promotion.title} />
                <div className='participant-text'>
                    <div className='participant-title'>Раздача #{promotion.index}</div>
                    <div className='participant-description'>{formatDate(promotion.start_date)} - {formatDate(promotion.end_date)}</div>
                </div>
            </div>
        </div>
    )
}