// Импорт стилей
import "@/components/ui/Promotion/Promotion.modules.css";

// Импорт компонентов
import Image from "next/image";

// Компонент
export default function Promotion({ title, description }) {
    return (
        <section className="promotion">
            <Image className="promotion-image" src="/preloader.gif" width={50} height={50} alt={title}/>
            <div className="promotion-content">
                <div className="promotion-title">{title}</div>
                <div className="promotion-description">{description}</div>
            </div>
        </section>
    );
}