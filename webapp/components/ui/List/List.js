// Импорт стилей
import "@/components/ui/List/List.modules.css";

// Импорт компонентов
import { useState, useEffect } from "react";
import { getPromotions } from "@/controllers/Promotions";
import Button from "@/components/ui/Button/Button";
import Preloader from "@/components/ui/Preloader/Preloader";
import Error from "@/components/ui/Error/Error";
import Image from "@/components/ui/Image/Image";

// Компонент
export default function List() {
    const [promotions, setPromotions] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Получаем все акции
    useEffect(() => {
        const fetchPromotions = async () => {
            const { response, error } = await getPromotions();
            // Если ошибка
            if (error) return;
            // Записываем данные
            setPromotions(response)
        }
        // Запускаем
        fetchPromotions()
    }, [])

    // Фильтрация акций
    const filteredPromotions = promotions?.filter(({ title }) =>
        name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <section className="list">
            <input className="list-input" placeholder="Поиск по названию..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            {filteredPromotions ? (
                filteredPromotions.length > 0 ? (
                    filteredPromotions.map(({ _id, title, title_id, description, status, banner_image }) => (
                        <div className="list-item" key={_id}>
                            <div className="list-header">
                                <div className="list-id">#{title_id}</div>
                                <span className={`list-status ${status !== "draft" ? 'list-active' : 'list-deactive'}`} >
                                    {status}
                                </span>
                            </div>
                            <div className="list-content">
                                <Image className="list-image" url={banner_image} width={350} height={350} alt={name} />
                                <div className="list-title">{title}</div>
                                <div className="list-description">{description}</div>
                            </div>
                            {status === "draft" && (
                                <div className="list-buttons">
                                    <Button name="Редактировать" icon="PencilSquareIcon" link={`/promotions/edit/${_id}`} />
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <Error title="Акции не найдены" description="Попробуйте изменить поисковый запрос или попробуйте повторить попытку позже." />
                )
            ) : (
                <Preloader />
            )}
        </section>
    );
}