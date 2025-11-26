"use client";

// Импорт стилей
import "@/components/pages/completed/Completed.modules.css";

// Импорт компонентов
import { useState, useEffect } from "react";
import { getWinnersParticipants } from "@/controllers/Participant";
import Page from "@/components/ui/Page/Page";
import Header from "@/components/ui/Header/Header";
import Button from "@/components/ui/Button/Button";
import Image from "next/image";

// Компонент
export default function Completed({ promotion }) {
	const [participants, setParticipants] = useState(null);

	useEffect(() => {
		const fetchParticipants = async () => {
			const { error, response } = await getWinnersParticipants(promotion._id);
			setParticipants(response);
		};
		fetchParticipants();
	}, [promotion]);

	return (
		<Page>
			<div className='completed'>
				<Header title={promotion.title} description={promotion._id} />
				<div className='completed-content'>
					<div className='completed-title'>Раздача закончилась:</div>
					<Image className="completed-image" src="/cheerful.png" width={150} height={150} alt="team" />
					<div className='completed-subtitle'>Список победителей:</div>
					<div className="completed-badges">
						{participants && participants.map(({ user_id }, id) => (
							<div key={id} className='completed-badge'>{user_id?.username}</div>
						))}
					</div>
					<div className='completed-description'>Посмотреть результаты раздачи можно в <a href={`${process.env.NEXT_PUBLIC_TELEGRAM_CHANNEL_URL}/${promotion.messages.public_result_id}`}>посте канала</a>.</div>
				</div>
				<Button name="Закрыть приложение" icon="XCircleIcon" className="text-yellow-900 !bg-yellow-400" event={() => Telegram.WebApp.close()} />
			</div>
		</Page>
	)
}