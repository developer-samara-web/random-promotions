// Импорт стилей
import "@/components/ui/List/List.modules.css";

// Импорт компонентов
import { useState, useEffect } from "react";
import { getPromotions } from "@/controllers/Promotions";
import Button from "@/components/ui/Button/Button";
import Preloader from "@/components/ui/Preloader/Preloader";
import Error from "@/components/ui/Error/Error";
import Image from "next/image";

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
    const filteredPromotions = promotions?.filter(({ name }) =>
        name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <section className="list">
            <input className="list-input" placeholder="Поиск по названию..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            {filteredPromotions ? (
                filteredPromotions.length > 0 ? (
                    filteredPromotions.map(({ _id, name, description, is_published, image }) => (
                        <div className="list-item" key={_id}>
                            <div className="list-header">
                                <div className="list-name">{name}</div>
                                <span className={`list-status ${is_published ? 'list-active' : 'list-deactive'}`} >
                                    {is_published ? 'Активна' : 'Не активна'}
                                </span>
                            </div>
                            <div className="list-content">
                                <Image className="list-image" src={image} width={350} height={350} alt={name} />
                                <div className="list-description">{description}</div>
                            </div>
                            <Button name="Редактировать" link={`/promotions/edit/${_id}`} />
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