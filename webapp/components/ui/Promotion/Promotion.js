// Импорт стилей
import "@/components/ui/Promotion/Promotion.modules.css";

// Импорт компонентов
import Image from "@/components/ui/Image/Image";

// Компонент
export default function Promotion({ title, description, image, status, subscribe }) {
    return (
        <section className="promotion">
            <div className="promotion-content">
                <div className="promotion-title">{title}</div>
                <div className="promotion-image">
                    <Image url={image} alt={title} />
                </div>
            </div>
        </section>
    );
}