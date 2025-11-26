"use client"

// Импорт стилей
import "@/components/pages/participant/Participant.modules.css";

// Импорт компонентов
import Page from "@/components/ui/Page/Page";
import Header from "@/components/ui/Header/Header";
import Button from "@/components/ui/Button/Button";
import formatDate from "@/utils/formatDate";
import Image from "next/image";

// Компонент "Повторное участие"
export default function Participant({ promotion }) {
	return (
		<Page>
			<div className='participant'>
				<Header title={promotion.title} description={promotion._id} />
				<div className='participant-content'>
					<Image className="participant-image" src="/pleased.png" width={150} height={150} alt="team" />
					<div className='participant-title'>Вы уже участвуете</div>
					{promotion.end_date && <div className='participant-badge'>Итоги: {formatDate(promotion.end_date)}</div>}
					<div className='participant-description'>Вы уже зарегистрированы для участия в этой раздаче. Повторное участие невозможно, но мы благодарим вас за интерес и желаем удачи!</div>
				</div>
				<Button name="Закрыть приложение" icon="XCircleIcon" className="text-yellow-900 !bg-yellow-400" event={() => Telegram.WebApp.close()} />
			</div>
		</Page>
	)
}
