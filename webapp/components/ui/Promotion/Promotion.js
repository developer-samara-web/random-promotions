// Импорт стилей
import "@/components/ui/Promotion/Promotion.modules.css";

// Импорт компонентов
import Badge from "@/components/ui/Badge/Badge";
import Image from "@/components/ui/Image/Image";

// Компонент
export default function Promotion({ title, description, image, status, subscribe }) {
    return (
        <section className="promotion">
            <div className="promotion-content">
                <div className="promotion-image">
                    <Image url={image} alt={title} />
                </div>
                <div className="promotion-title">{title}</div>
                <div className="promotion-description">{description}</div>
                <div className="promotion-list">
                    <li className="promotion-line">
                        <span className="promotion-name">Вид раздачи:</span>
                        <Badge status={subscribe} content={subscribe ? 'Премиум' : 'Обычная'} className={subscribe ? '!bg-yellow-300 text-black' : '!bg-slate-300 text-black'} />
                    </li>
                    <li className="promotion-line">
                        <span className="promotion-name">Статус раздачи:</span>
                        <Badge status={status} content={status ? 'Активна' : 'Не активна'} />
                    </li>
                </div>
            </div>
        </section>
    );
}